// 📚 DEBUGZONE: QUIZ BANK
// Koleksi tantangan koding untuk Battle System

import { QuizQuestion } from '@/types/game';

export const quizBank: QuizQuestion[] = [
  {
    id: 'q001',
    question: 'Apa output dari code berikut?',
    code: `console.log(typeof null);`,
    options: ['null', 'undefined', 'object', 'NaN'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'typeof null mengembalikan "object" - ini adalah bug terkenal di JavaScript yang dipertahankan untuk backward compatibility.',
  },
  {
    id: 'q002',
    question: 'Manakah cara yang benar untuk membuat array di JavaScript?',
    options: [
      'const arr = (1, 2, 3);',
      'const arr = [1, 2, 3];',
      'const arr = {1, 2, 3};',
      'const arr = <1, 2, 3>;',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Array di JavaScript dibuat menggunakan bracket notation [].',
  },
  {
    id: 'q003',
    question: 'Apa yang salah dengan loop ini?',
    code: `for (let i = 0; i < 10; i--) {
  console.log(i);
}`,
    options: [
      'i harus dimulai dari 10',
      'i-- seharusnya i++',
      'Harus menggunakan while loop',
      'Tidak ada yang salah',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Loop menggunakan i-- yang akan membuat infinite loop karena i tidak pernah mencapai 10. Seharusnya menggunakan i++ untuk increment.',
  },
  {
    id: 'q004',
    question: 'Apa output dari code berikut?',
    code: `console.log(1 + "2" + 3);`,
    options: ['6', '123', '15', '33'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'JavaScript melakukan type coercion. 1 + "2" = "12" (string), lalu "12" + 3 = "123" (string concatenation).',
  },
  {
    id: 'q005',
    question: 'Manakah yang BUKAN merupakan tipe data primitif di JavaScript?',
    options: ['string', 'boolean', 'array', 'number'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Array adalah tipe data object, bukan primitif. Tipe primitif di JS adalah: string, number, boolean, null, undefined, symbol, dan bigint.',
  },
  {
    id: 'q006',
    question: 'Apa yang dilakukan method array.map()?',
    options: [
      'Mengubah array original',
      'Membuat array baru dengan transformasi',
      'Menghapus elemen array',
      'Menggabungkan dua array',
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Array.map() membuat array baru dengan hasil transformasi setiap elemen, tanpa mengubah array original.',
  },
  {
    id: 'q007',
    question: 'Bagaimana cara yang benar untuk declare function di JavaScript?',
    code: `// Pilih syntax yang VALID`,
    options: [
      'function myFunc() {}',
      'const myFunc = () => {}',
      'const myFunc = function() {}',
      'Semua benar',
    ],
    correctAnswer: 3,
    difficulty: 'easy',
    explanation: 'Ketiga cara tersebut valid. Function declaration, arrow function, dan function expression semuanya adalah cara yang benar.',
  },
  {
    id: 'q008',
    question: 'Apa output dari code berikut?',
    code: `const obj = { a: 1 };
const obj2 = obj;
obj2.a = 2;
console.log(obj.a);`,
    options: ['1', '2', 'undefined', 'Error'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Object adalah reference type. obj2 menunjuk ke object yang sama dengan obj, sehingga perubahan pada obj2 juga mengubah obj.',
  },
  {
    id: 'q009',
    question: 'Operator mana yang digunakan untuk strict equality check?',
    options: ['=', '==', '===', '!=='],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: '=== melakukan strict equality check (tipe dan nilai harus sama), sedangkan == melakukan type coercion.',
  },
  {
    id: 'q010',
    question: 'Apa output dari code berikut?',
    code: `console.log([] + []);`,
    options: ['[]', '""', '0', 'undefined'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Ketika array dijumlahkan, JavaScript mengkonversinya ke string. [] menjadi "", sehingga "" + "" = "".',
  },
  {
    id: 'q011',
    question: 'Method apa yang digunakan untuk menambah elemen di akhir array?',
    options: ['append()', 'push()', 'add()', 'insert()'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Array.push() menambahkan satu atau lebih elemen ke akhir array dan mengembalikan panjang array yang baru.',
  },
  {
    id: 'q012',
    question: 'Apa perbedaan antara let dan const?',
    options: [
      'Tidak ada perbedaan',
      'const tidak bisa di-reassign',
      'let hanya untuk numbers',
      'const lebih cepat',
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'const tidak bisa di-reassign setelah deklarasi awal, sedangkan let bisa. Keduanya memiliki block scope.',
  },
];
