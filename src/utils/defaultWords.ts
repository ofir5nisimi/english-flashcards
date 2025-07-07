import { Word } from '../context/AppContext';

export const defaultWords: Word[] = [
  // Level 1 - Basic items and colors (10 words)
  { id: 'default-1', emoji: '🍎', english: 'Apple', hebrew: 'תפוח', level: 1 },
  { id: 'default-2', emoji: '🍌', english: 'Banana', hebrew: 'בננה', level: 1 },
  { id: 'default-3', emoji: '🐱', english: 'Cat', hebrew: 'חתול', level: 1 },
  { id: 'default-4', emoji: '🐶', english: 'Dog', hebrew: 'כלב', level: 1 },
  { id: 'default-5', emoji: '🏠', english: 'House', hebrew: 'בית', level: 1 },
  { id: 'default-6', emoji: '🚗', english: 'Car', hebrew: 'מכונית', level: 1 },
  { id: 'default-7', emoji: '📚', english: 'Book', hebrew: 'ספר', level: 1 },
  { id: 'default-8', emoji: '💧', english: 'Water', hebrew: 'מים', level: 1 },
  { id: 'default-9', emoji: '🌞', english: 'Sun', hebrew: 'שמש', level: 1 },
  { id: 'default-10', emoji: '🌙', english: 'Moon', hebrew: 'ירח', level: 1 },

  // Level 2 - Body parts and family (10 words)
  { id: 'default-11', emoji: '👁️', english: 'Eye', hebrew: 'עין', level: 2 },
  { id: 'default-12', emoji: '👂', english: 'Ear', hebrew: 'אוזן', level: 2 },
  { id: 'default-13', emoji: '👃', english: 'Nose', hebrew: 'אף', level: 2 },
  { id: 'default-14', emoji: '👄', english: 'Mouth', hebrew: 'פה', level: 2 },
  { id: 'default-15', emoji: '✋', english: 'Hand', hebrew: 'יד', level: 2 },
  { id: 'default-16', emoji: '👨', english: 'Father', hebrew: 'אבא', level: 2 },
  { id: 'default-17', emoji: '👩', english: 'Mother', hebrew: 'אמא', level: 2 },
  { id: 'default-18', emoji: '👦', english: 'Boy', hebrew: 'ילד', level: 2 },
  { id: 'default-19', emoji: '👧', english: 'Girl', hebrew: 'ילדה', level: 2 },
  { id: 'default-20', emoji: '👴', english: 'Grandfather', hebrew: 'סבא', level: 2 },

  // Level 3 - Food and drinks (10 words)
  { id: 'default-21', emoji: '🍞', english: 'Bread', hebrew: 'לחם', level: 3 },
  { id: 'default-22', emoji: '🧀', english: 'Cheese', hebrew: 'גבינה', level: 3 },
  { id: 'default-23', emoji: '🥛', english: 'Milk', hebrew: 'חלב', level: 3 },
  { id: 'default-24', emoji: '🍖', english: 'Meat', hebrew: 'בשר', level: 3 },
  { id: 'default-25', emoji: '🐟', english: 'Fish', hebrew: 'דג', level: 3 },
  { id: 'default-26', emoji: '🥕', english: 'Carrot', hebrew: 'גזר', level: 3 },
  { id: 'default-27', emoji: '🍅', english: 'Tomato', hebrew: 'עגבנייה', level: 3 },
  { id: 'default-28', emoji: '☕', english: 'Coffee', hebrew: 'קפה', level: 3 },
  { id: 'default-29', emoji: '🍵', english: 'Tea', hebrew: 'תה', level: 3 },
  { id: 'default-30', emoji: '🍰', english: 'Cake', hebrew: 'עוגה', level: 3 },

  // Level 4 - School and work (10 words)
  { id: 'default-31', emoji: '✏️', english: 'Pencil', hebrew: 'עיפרון', level: 4 },
  { id: 'default-32', emoji: '📝', english: 'Paper', hebrew: 'נייר', level: 4 },
  { id: 'default-33', emoji: '🏫', english: 'School', hebrew: 'בית ספר', level: 4 },
  { id: 'default-34', emoji: '👨‍🏫', english: 'Teacher', hebrew: 'מורה', level: 4 },
  { id: 'default-35', emoji: '🎒', english: 'Backpack', hebrew: 'תיק', level: 4 },
  { id: 'default-36', emoji: '💼', english: 'Briefcase', hebrew: 'מזוודה', level: 4 },
  { id: 'default-37', emoji: '🖥️', english: 'Computer', hebrew: 'מחשב', level: 4 },
  { id: 'default-38', emoji: '📱', english: 'Phone', hebrew: 'טלפון', level: 4 },
  { id: 'default-39', emoji: '⏰', english: 'Clock', hebrew: 'שעון', level: 4 },
  { id: 'default-40', emoji: '📅', english: 'Calendar', hebrew: 'לוח שנה', level: 4 },

  // Level 5 - Nature and weather (10 words)
  { id: 'default-41', emoji: '🌳', english: 'Tree', hebrew: 'עץ', level: 5 },
  { id: 'default-42', emoji: '🌸', english: 'Flower', hebrew: 'פרח', level: 5 },
  { id: 'default-43', emoji: '🌱', english: 'Plant', hebrew: 'צמח', level: 5 },
  { id: 'default-44', emoji: '🌊', english: 'Ocean', hebrew: 'אוקיינוס', level: 5 },
  { id: 'default-45', emoji: '⛰️', english: 'Mountain', hebrew: 'הר', level: 5 },
  { id: 'default-46', emoji: '🌧️', english: 'Rain', hebrew: 'גשם', level: 5 },
  { id: 'default-47', emoji: '❄️', english: 'Snow', hebrew: 'שלג', level: 5 },
  { id: 'default-48', emoji: '🌪️', english: 'Wind', hebrew: 'רוח', level: 5 },
  { id: 'default-49', emoji: '⚡', english: 'Lightning', hebrew: 'ברק', level: 5 },
  { id: 'default-50', emoji: '🌈', english: 'Rainbow', hebrew: 'קשת בענן', level: 5 }
];

export const loadDefaultWords = (): Word[] => {
  return [...defaultWords];
}; 