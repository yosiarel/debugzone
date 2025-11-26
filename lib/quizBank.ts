// 📚 DEBUGZONE: QUIZ BANK
// Koleksi tantangan koding untuk Battle System

import { QuizQuestion } from '@/types/game';

// 🔥 TIME ATTACK QUESTIONS (Boss Server Room)
export const timeAttackQuestions: QuizQuestion[] = [
  {
    id: 'time-001',
    question: 'CEPAT! Apa output dari code ini?',
    code: `console.log(2 ** 3);`,
    options: ['6', '8', '23', '9'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: '** adalah operator exponential. 2 ** 3 = 2³ = 8',
    challengeType: 'time-attack',
    timeLimit: 10,
  },
  {
    id: 'time-002',
    question: 'CEPAT! Method apa yang menambahkan elemen ke akhir array?',
    options: ['pop()', 'push()', 'shift()', 'unshift()'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'push() menambahkan elemen ke akhir array',
    challengeType: 'time-attack',
    timeLimit: 8,
  },
  {
    id: 'time-003',
    question: 'CEPAT! Apa hasil dari 5 % 2?',
    options: ['2.5', '2', '1', '0'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Operator % (modulo) mengembalikan sisa pembagian. 5 % 2 = 1',
    challengeType: 'time-attack',
    timeLimit: 7,
  },
];

// 🔥 FILL THE BLANK QUESTIONS (Boss Weapon Room)
export const fillBlankQuestions: QuizQuestion[] = [
  {
    id: 'fill-001',
    question: 'Lengkapi code untuk membuat function arrow:',
    code: `const add = (a, b) ___ a + b;`,
    options: ['→', '=>', '->', '::'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Arrow function menggunakan => syntax',
    challengeType: 'fill-blank',
    blanks: ['=>'],
  },
  {
    id: 'fill-002',
    question: 'Lengkapi untuk destructure object:',
    code: `const ___ name, age } = person;`,
    options: ['(', '[', '{', '<'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Destructuring object menggunakan curly braces {}',
    challengeType: 'fill-blank',
    blanks: ['{'],
  },
  {
    id: 'fill-003',
    question: 'Lengkapi async function:',
    code: `async function getData() {
  const data = ___ fetch(url);
}`,
    options: ['wait', 'await', 'async', 'promise'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'await digunakan untuk menunggu promise dalam async function',
    challengeType: 'fill-blank',
    blanks: ['await'],
  },
];

// 🔥 SPEED QUIZ QUESTIONS (Boss Storage Room)
export const speedQuizQuestions: QuizQuestion[] = [
  {
    id: 'speed-001',
    question: 'TRUE or FALSE: JavaScript adalah bahasa compiled',
    options: ['TRUE', 'FALSE'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'JavaScript adalah interpreted language, bukan compiled',
    challengeType: 'speed-quiz',
    timeLimit: 5,
  },
  {
    id: 'speed-002',
    question: 'TRUE or FALSE: === membandingkan nilai dan tipe data',
    options: ['TRUE', 'FALSE'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: '=== melakukan strict equality check (nilai dan tipe)',
    challengeType: 'speed-quiz',
    timeLimit: 5,
  },
  {
    id: 'speed-003',
    question: 'TRUE or FALSE: const variable bisa diubah nilainya',
    options: ['TRUE', 'FALSE'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'const tidak bisa di-reassign (tapi object properties bisa diubah)',
    challengeType: 'speed-quiz',
    timeLimit: 5,
  },
];

// 🔥 CODE DEBUG QUESTIONS (Final Boss)
export const codeDebugQuestions: QuizQuestion[] = [
  {
    id: 'debug-001',
    question: 'Bug apa yang ada di code ini?',
    code: `function sum(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
    options: [
      'i harus mulai dari 1',
      'i <= harus jadi i <',
      'Harus gunakan forEach',
      'Tidak ada bug',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'i <= arr.length akan mengakses index di luar array (undefined), harusnya i < arr.length',
    challengeType: 'code-debug',
  },
  {
    id: 'debug-002',
    question: 'Kenapa code ini return undefined?',
    code: `function getPerson() {
  return
    {
      name: 'John'
    };
}`,
    options: [
      'Object literal salah',
      'return dan { harus 1 baris',
      'Harus gunakan const',
      'Semicolon hilang',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'JavaScript auto-insert semicolon setelah return. { harus di baris yang sama dengan return',
    challengeType: 'code-debug',
  },
  {
    id: 'debug-003',
    question: 'Memory leak ada dimana?',
    code: `function createCounter() {
  let count = 0;
  setInterval(() => {
    count++;
    console.log(count);
  }, 1000);
}
createCounter();`,
    options: [
      'count tidak di-reset',
      'setInterval tidak di-clear',
      'console.log terlalu sering',
      'Tidak ada memory leak',
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'setInterval terus berjalan tanpa clearInterval, menyebabkan memory leak',
    challengeType: 'code-debug',
  },
];

// Regular quiz bank for non-boss enemies
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
