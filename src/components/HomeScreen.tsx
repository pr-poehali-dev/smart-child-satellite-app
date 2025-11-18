import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Screen = 'home' | 'camera' | 'english' | 'profile' | 'achievements';

interface HomeScreenProps {
  totalStars: number;
  childName: string;
  setCurrentScreen: (screen: Screen) => void;
}

export default function HomeScreen({ totalStars, childName, setCurrentScreen }: HomeScreenProps) {
  return (
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
}
