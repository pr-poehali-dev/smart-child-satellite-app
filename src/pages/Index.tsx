import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import HomeScreen from '@/components/HomeScreen';
import CameraScreen from '@/components/CameraScreen';
import EnglishScreen from '@/components/EnglishScreen';
import ProfileScreen from '@/components/ProfileScreen';

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
  const [cameraActive, setCameraActive] = useState(false);
  
  const [childName] = useState('Маша');
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

  const completeLesson = (lessonId: string) => {
    setTotalStars(prev => prev + 5);
    toast.success('Урок пройден! +5 звёзд ⭐');
  };

  useEffect(() => {
    if (currentScreen !== 'camera') {
      setBrightness(0);
      setCameraActive(false);
    }
  }, [currentScreen]);

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen 
          totalStars={totalStars} 
          childName={childName} 
          setCurrentScreen={setCurrentScreen} 
        />
      )}
      {currentScreen === 'camera' && (
        <CameraScreen 
          brightness={brightness}
          setBrightness={setBrightness}
          cameraActive={cameraActive}
          setCameraActive={setCameraActive}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'english' && (
        <EnglishScreen 
          lessons={lessons}
          setCurrentScreen={setCurrentScreen}
          completeLesson={completeLesson}
        />
      )}
      {(currentScreen === 'profile' || currentScreen === 'achievements') && (
        <ProfileScreen 
          childName={childName}
          childAge={childAge}
          totalStars={totalStars}
          lessons={lessons}
          achievements={achievements}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </>
  );
}
