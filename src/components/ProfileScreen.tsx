import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

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

interface ProfileScreenProps {
  childName: string;
  childAge: number;
  totalStars: number;
  lessons: Lesson[];
  achievements: Achievement[];
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

export default function ProfileScreen({ 
  childName, 
  childAge, 
  totalStars, 
  lessons, 
  achievements, 
  currentScreen, 
  setCurrentScreen 
}: ProfileScreenProps) {
  if (currentScreen === 'profile') {
    return (
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
  }

  return (
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
}
