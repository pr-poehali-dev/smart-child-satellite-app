import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Screen = 'home' | 'camera' | 'english' | 'profile' | 'achievements';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  words: { english: string; russian: string }[];
  completed: boolean;
}

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [brightness, setBrightness] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [childName, setChildName] = useState('Маша');
  const [childAge] = useState(7);
  const [totalStars, setTotalStars] = useState(45);
  
  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Животные',
      emoji: '🐶',
      words: [
        { english: 'Cat', russian: 'Кот' },
        { english: 'Dog', russian: 'Собака' },
        { english: 'Bird', russian: 'Птица' },
        { english: 'Fish', russian: 'Рыба' }
      ],
      completed: true
    },
    {
      id: '2',
      title: 'Цвета',
      emoji: '🎨',
      words: [
        { english: 'Red', russian: 'Красный' },
        { english: 'Blue', russian: 'Синий' },
        { english: 'Green', russian: 'Зелёный' },
        { english: 'Yellow', russian: 'Жёлтый' }
      ],
      completed: true
    },
    {
      id: '3',
      title: 'Числа',
      emoji: '🔢',
      words: [
        { english: 'One', russian: 'Один' },
        { english: 'Two', russian: 'Два' },
        { english: 'Three', russian: 'Три' },
        { english: 'Four', russian: 'Четыре' }
      ],
      completed: false
    },
    {
      id: '4',
      title: 'Семья',
      emoji: '👨‍👩‍👧',
      words: [
        { english: 'Mom', russian: 'Мама' },
        { english: 'Dad', russian: 'Папа' },
        { english: 'Sister', russian: 'Сестра' },
        { english: 'Brother', russian: 'Брат' }
      ],
      completed: false
    }
  ]);
  
  const [achievements] = useState<Achievement[]>([
    { id: '1', title: 'Первый урок', icon: '📚', unlocked: true },
    { id: '2', title: 'Неделя занятий', icon: '🔥', unlocked: true },
    { id: '3', title: 'Мастер слов', icon: '✨', unlocked: true },
    { id: '4', title: '50 звёзд', icon: '⭐', unlocked: false },
    { id: '5', title: 'Юный полиглот', icon: '🌍', unlocked: false },
    { id: '6', title: 'Чемпион', icon: '🏆', unlocked: false }
  ]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast.success('Камера включена!');
      }
    } catch (error) {
      toast.error('Не удалось получить доступ к камере');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      setIsScanning(false);
    }
  };

  const scanBrightness = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      toast.error('Камера ещё загружается, подождите немного');
      return;
    }
    
    setIsScanning(true);
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

    if (avgBrightness > 70) {
      toast.success('Отлично! Это окно - много света! ☀️');
    } else if (avgBrightness > 40) {
      toast('Неплохо, но можно светлее');
    } else {
      toast.error('Слишком темно для окна');
    }

    setTimeout(() => setIsScanning(false), 1000);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Озвучка не поддерживается в этом браузере');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const completeLesson = (lessonId: string) => {
    setTotalStars(prev => prev + 5);
    toast.success('Урок пройден! +5 звёзд ⭐');
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-gentle inline-block">👨‍🚀</div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Умный спутник</h1>
          <p className="text-lg text-purple-500">детства</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Icon name="Star" className="text-yellow-500" size={24} />
            <span className="text-2xl font-bold text-purple-600">{totalStars}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-purple-400 to-purple-500 border-0 text-white"
            onClick={() => setCurrentScreen('camera')}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-3">📸</div>
              <h3 className="font-bold text-lg">Камера</h3>
              <p className="text-xs opacity-90 mt-1">Найди окно</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-pink-400 to-pink-500 border-0 text-white"
            onClick={() => setCurrentScreen('english')}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-bold text-lg">Английский</h3>
              <p className="text-xs opacity-90 mt-1">4 урока</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-blue-400 to-blue-500 border-0 text-white"
            onClick={() => setCurrentScreen('profile')}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-3">👤</div>
              <h3 className="font-bold text-lg">Профиль</h3>
              <p className="text-xs opacity-90 mt-1">{childName}</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-yellow-400 to-yellow-500 border-0 text-white"
            onClick={() => setCurrentScreen('achievements')}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="font-bold text-lg">Награды</h3>
              <p className="text-xs opacity-90 mt-1">3 из 6</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white/80 backdrop-blur border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center gap-2">
              <Icon name="Info" size={20} />
              Для родителей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Это демо-версия приложения для присмотра, обучения и воспитания детей. 
              Камера помогает определить окно по яркости, раздел английского содержит интерактивные уроки.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCamera = () => (
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

              {isScanning && (
                <div className="absolute inset-0 border-4 border-green-400 animate-pulse"></div>
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
                <>
                  <Button 
                    onClick={scanBrightness}
                    disabled={isScanning}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <Icon name="Scan" size={20} className="mr-2" />
                    {isScanning ? 'Сканирую...' : 'Сканировать'}
                  </Button>
                  <Button 
                    onClick={stopCamera}
                    variant="destructive"
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </>
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
                  Наведи камеру на окно. Если яркость больше 70%, значит это действительно окно с хорошим освещением!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEnglish = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentScreen('home')}
            className="text-purple-600"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600">Английский 🎓</h2>
          <div className="w-10"></div>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className={`cursor-pointer hover:scale-102 transition-all ${
                lesson.completed ? 'bg-green-50 border-green-300' : 'bg-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{lesson.emoji}</div>
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription>{lesson.words.length} слов</CardDescription>
                    </div>
                  </div>
                  {lesson.completed && (
                    <Badge className="bg-green-500">
                      <Icon name="Check" size={16} />
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lesson.words.map((word, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-600">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-purple-900">{word.english}</p>
                          <p className="text-xs text-purple-600">{word.russian}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakWord(word.english)}
                        className="h-8 w-8 p-0 hover:bg-purple-200"
                      >
                        <Icon name="Volume2" size={18} className="text-purple-600" />
                      </Button>
                    </div>
                  ))}
                </div>
                {!lesson.completed && (
                  <Button 
                    onClick={() => completeLesson(lesson.id)}
                    className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
                  >
                    Завершить урок +5⭐
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <p className="font-bold text-xl mb-1">Прогресс обучения</p>
              <p className="text-sm opacity-90">
                Пройдено {lessons.filter(l => l.completed).length} из {lessons.length} уроков
              </p>
              <Progress 
                value={(lessons.filter(l => l.completed).length / lessons.length) * 100} 
                className="mt-3 h-2 bg-white/30"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentScreen('home')}
            className="text-purple-600"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600">Профиль 👤</h2>
          <div className="w-10"></div>
        </div>

        <Card className="mb-4 bg-gradient-to-br from-purple-400 to-pink-400 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white">
                <AvatarImage src="" />
                <AvatarFallback className="text-3xl bg-white text-purple-500">
                  {childName[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold mb-1">{childName}</h3>
              <p className="text-sm opacity-90">{childAge} лет</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Icon name="Star" size={24} />
                <span className="text-3xl font-bold">{totalStars}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center gap-2">
                <Icon name="Target" size={20} />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Пройдено уроков:</span>
                <Badge variant="secondary">{lessons.filter(l => l.completed).length}/{lessons.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Всего звёзд:</span>
                <Badge className="bg-yellow-500">{totalStars} ⭐</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Наград получено:</span>
                <Badge className="bg-purple-500">{achievements.filter(a => a.unlocked).length}/6 🏆</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Прогресс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Английский</span>
                    <span className="font-medium">{Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)}%</span>
                  </div>
                  <Progress value={(lessons.filter(l => l.completed).length / lessons.length) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Достижения</span>
                    <span className="font-medium">{Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%</span>
                  </div>
                  <Progress value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentScreen('home')}
            className="text-purple-600"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600">Награды 🏆</h2>
          <div className="w-10"></div>
        </div>

        <Card className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl mb-2 animate-bounce-gentle">🏆</div>
            <p className="text-lg font-bold mb-1">
              Получено наград: {achievements.filter(a => a.unlocked).length} из {achievements.length}
            </p>
            <p className="text-sm opacity-90">Продолжай заниматься!</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card 
              key={achievement.id}
              className={`cursor-pointer transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:scale-105' 
                  : 'bg-gray-100 opacity-60'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <div className={`text-5xl mb-3 ${achievement.unlocked ? 'animate-scale-in' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <h3 className="font-bold text-sm">{achievement.title}</h3>
                {achievement.unlocked && (
                  <Badge className="mt-2 bg-green-500">
                    <Icon name="Check" size={12} className="mr-1" />
                    Получено
                  </Badge>
                )}
                {!achievement.unlocked && (
                  <Badge variant="secondary" className="mt-2">
                    <Icon name="Lock" size={12} className="mr-1" />
                    Закрыто
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-3xl">🎯</div>
              <div>
                <p className="font-medium text-purple-900">Как получить награды?</p>
                <p className="text-sm text-purple-700 mt-1">
                  Проходи уроки, зарабатывай звёзды и открывай новые достижения! 
                  Каждая награда - это новая победа!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'camera' && renderCamera()}
      {currentScreen === 'english' && renderEnglish()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'achievements' && renderAchievements()}
    </>
  );
}