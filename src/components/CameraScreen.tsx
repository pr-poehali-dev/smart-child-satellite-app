import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Screen = 'home' | 'camera' | 'english' | 'profile' | 'achievements';

interface CameraScreenProps {
  brightness: number;
  setBrightness: (value: number) => void;
  cameraActive: boolean;
  setCameraActive: (value: boolean) => void;
  setCurrentScreen: (screen: Screen) => void;
}

export default function CameraScreen({ 
  brightness, 
  setBrightness, 
  cameraActive, 
  setCameraActive, 
  setCurrentScreen 
}: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scanBrightness = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let sum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += avg;
    }

    const avgBrightness = Math.round((sum / (data.length / 4) / 255) * 100);
    setBrightness(avgBrightness);
  };

  const startAutoScan = () => {
    if (scanIntervalRef.current) return;
    scanIntervalRef.current = setInterval(() => {
      scanBrightness();
    }, 1000);
  };

  const stopAutoScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true);
          startAutoScan();
          toast.success('Камера включена! Автоматическое сканирование началось');
        };
      }
    } catch (error) {
      toast.error('Не удалось получить доступ к камере');
    }
  };

  const stopCamera = () => {
    stopAutoScan();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      setBrightness(0);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      stopAutoScan();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentScreen('home')}
            className="text-purple-600"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600">Камера 📸</h2>
          <div className="w-10"></div>
        </div>

        <Card className="mb-4 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-purple-600">Определение окна</CardTitle>
            <CardDescription>Наведи камеру на окно, чтобы проверить яркость</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Icon name="Camera" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Камера выключена</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <span className="text-sm font-medium">Текущая яркость:</span>
                <Badge 
                  variant={brightness > 50 ? 'default' : 'secondary'}
                  className={brightness > 50 ? 'bg-green-500 text-lg px-4 py-1' : 'text-lg px-4 py-1'}
                >
                  {brightness}%
                </Badge>
              </div>

              {cameraActive && brightness > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <Progress value={brightness} className="h-3" />
                  <p className="text-xs text-gray-500 text-center">
                    {brightness > 70 ? '☀️ Отлично! Это окно!' : 
                     brightness > 40 ? '🌤️ Неплохо' : 
                     '🌙 Слишком темно'}
                  </p>
                </div>
              )}

              {brightness > 50 && (
                <div className="p-4 bg-green-100 border-2 border-green-500 rounded-xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full absolute"></div>
                    <p className="font-bold text-green-900 ml-4">
                      🚨 СИГНАЛ! Яркость превышает 50%!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!cameraActive ? (
                <Button 
                  onClick={startCamera}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  <Icon name="Camera" size={20} className="mr-2" />
                  Включить камеру
                </Button>
              ) : (
                <Button 
                  onClick={stopCamera}
                  variant="destructive"
                  className="flex-1"
                >
                  <Icon name="X" size={20} className="mr-2" />
                  Выключить камеру
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <p className="font-medium text-blue-900">Подсказка</p>
                <p className="text-sm text-blue-700">
                  Яркость определяется автоматически каждую секунду. Если больше 50% - загорается сигнал!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
