import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Screen = 'home' | 'camera' | 'english' | 'profile' | 'achievements';

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  words: { english: string; russian: string }[];
  completed: boolean;
}

interface EnglishScreenProps {
  lessons: Lesson[];
  setCurrentScreen: (screen: Screen) => void;
  completeLesson: (lessonId: string) => void;
}

export default function EnglishScreen({ lessons, setCurrentScreen, completeLesson }: EnglishScreenProps) {
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

  return (
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
}
