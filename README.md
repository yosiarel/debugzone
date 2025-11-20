# 🎮 DEBUGZONE: THE CYBER ARENA

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.181-green)

> **A High-End WebGL First-Person Exploration Game where you battle with Code, not Bullets.**

Masuki dunia digital imersif bertema Cyberpunk futuristik. Sebagai calon **Code Champion**, Anda akan melawan Glitch, Bug, dan Virus menggunakan senjata paling kuat: **Syntax Knowledge**.

---

## 🌌 VISI PROYEK

DebugZone bukan sekadar game browser biasa. Ini adalah pengalaman **imersif 3D** yang menggabungkan:

- 🎨 **Estetika Cyberpunk Premium** (TRON Legacy meets Cyberpunk 2077)
- 🎮 **First-Person Gameplay** dengan kontrol PointerLock
- 🧠 **Coding Challenges** sebagai mekanisme pertarungan
- ⚡ **Real-time Physics** dengan Rapier
- 🌟 **High-End Graphics** dengan Post-Processing (Bloom, Vignette, Chromatic Aberration)

---

## ✨ FITUR UTAMA

### 🎯 Core Gameplay
- **First-Person Exploration**: Jelajahi labirin futuristik dengan kontrol WASD + Mouse
- **Battle System**: Dekati musuh untuk memicu duel koding
- **Quiz Challenges**: Jawab soal JavaScript untuk menyerang musuh
- **Health Management**: Jaga Firewall Integrity (HP) Anda
- **Victory Condition**: Eliminasi semua threats untuk jadi Champion

### 🎨 Visual Excellence
- **Neon Grid Floor** dengan animasi bergerak
- **Volumetric Fog** untuk atmosfer misterius
- **Dynamic Lighting** (Cyan/Magenta point lights)
- **Floating Starfield** di background
- **Geometric Enemies** dengan glow effects
- **Cinematic Post-Processing** (Bloom, Vignette, CA)

### 🎨 UI/UX
- **Futuristic HUD** dengan health bar dan score
- **Quiz Terminal** dengan syntax highlighting
- **Victory Screen** dengan confetti particles
- **Game Over Screen** dengan glitch effects
- **Intro Screen** dengan mission briefing

---

## 🛠️ TEKNOLOGI STACK

### Core Framework
- **Next.js 14+** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling system

### 3D Engine
- **Three.js** - WebGL rendering
- **React Three Fiber** - React renderer untuk Three.js
- **@react-three/drei** - Helpful utilities
- **@react-three/rapier** - Physics engine
- **@react-three/postprocessing** - Visual effects

### State Management
- **Zustand** - Lightweight state management

---

## 🚀 INSTALASI & SETUP

### Prerequisites
- Node.js 18+ atau lebih tinggi
- npm atau yarn

### Langkah Instalasi

```bash
# Clone repository (jika dari Git)
git clone <repository-url>
cd debugzone

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000)

---

## 🎮 CARA BERMAIN

### Kontrol
- **WASD** - Bergerak (Forward, Left, Backward, Right)
- **SPACE** - Melompat
- **MOUSE** - Melihat sekeliling (First-Person Camera)
- **Click** - Lock pointer (diperlukan untuk bermain)
- **ESC** - Unlock pointer

### Mekanisme Battle
1. **Eksplorasi**: Jelajahi arena untuk mencari musuh
2. **Proximity Warning**: Muncul saat Anda mendekat (3-5 meter)
3. **Battle Trigger**: Battle dimulai saat jarak < 3 meter
4. **Quiz Challenge**: Pilih jawaban yang benar
   - ✅ **Correct**: Musuh kehilangan 25 HP
   - ❌ **Wrong**: Anda kehilangan 15 HP
5. **Victory**: Kalahkan semua musuh untuk menang!

### Tipe Enemy
- 🔴 **Glitch** (50 HP) - Easy difficulty
- 🟠 **Bug** (75 HP) - Medium difficulty
- 🟣 **Virus** (100 HP) - Hard difficulty

---

## 📁 STRUKTUR PROYEK

```
debugzone/
├── app/
│   ├── page.tsx              # Main entry point
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + animations
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx         # Main 3D scene dengan physics
│   │   ├── Level.tsx         # Environment (floor, walls, lights)
│   │   ├── Player.tsx        # First-person controller
│   │   └── Enemy.tsx         # Enemy AI dengan proximity detection
│   └── ui/
│       ├── HUD.tsx           # Health bar & score display
│       ├── QuizTerminal.tsx  # Battle quiz interface
│       ├── VictoryScreen.tsx # Win condition screen
│       ├── GameOverScreen.tsx # Defeat screen
│       └── LoadingScreen.tsx  # Loading state
├── stores/
│   └── gameStore.ts          # Zustand state management
├── types/
│   └── game.ts               # TypeScript type definitions
├── lib/
│   └── quizBank.ts           # Question database
└── package.json
```

---

## 🎨 CUSTOMIZATION

### Menambah Soal Quiz

Edit `lib/quizBank.ts`:

```typescript
{
  id: 'q013',
  question: 'Pertanyaan Anda',
  code: 'console.log("optional code")', // Optional
  options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
  correctAnswer: 0, // Index dari jawaban benar
  difficulty: 'easy',
  explanation: 'Penjelasan jawaban',
}
```

### Menambah Enemy

Edit `stores/gameStore.ts`, tambahkan di array `enemies`:

```typescript
{
  id: 'new-enemy-001',
  health: 60,
  maxHealth: 60,
  position: [15, 0.5, -10],
  isDefeated: false,
  type: 'glitch',
}
```

### Mengubah Lighting

Edit `components/3d/Level.tsx`, modifikasi pointLight:

```typescript
<pointLight
  position={[x, y, z]}
  intensity={50}
  color="#hexcolor"
  distance={30}
/>
```

---

## 🎯 ROADMAP

### Phase 1 ✅ (Completed)
- [x] Environment construction
- [x] Player controller dengan physics
- [x] Enemy system dengan AI
- [x] HUD & Quiz Terminal
- [x] Post-processing effects

### Phase 2 🚧 (Future)
- [ ] Multiplayer support
- [ ] Level selection system
- [ ] Achievement system
- [ ] Leaderboard integration
- [ ] Mobile support dengan touch controls
- [ ] Sound effects & background music
- [ ] More enemy types (Trojan, Worm, etc.)
- [ ] Power-ups system
- [ ] Difficulty settings

---

## 🐛 TROUBLESHOOTING

### Issue: Pointer Lock tidak bekerja
**Solution**: Pastikan Anda sudah **klik** di dalam canvas area.

### Issue: Frame rate rendah
**Solution**: 
1. Disable post-processing effects di `Scene.tsx`
2. Reduce jumlah stars di `Level.tsx`
3. Lower shadow quality

### Issue: Physics collision tidak akurat
**Solution**: Pastikan `@react-three/rapier` sudah terinstall dengan benar.

---

## 📝 LICENSE

MIT License - Feel free to use this project for learning purposes.

---

## 🙏 CREDITS

**Developed by**: Lead Game Architect & Senior Graphics Engineer  
**Framework**: Next.js, React Three Fiber, Three.js  
**Inspiration**: TRON Legacy, Cyberpunk 2077, Hacker Culture  

---

## 🔗 RESOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/)
- [Rapier Physics](https://rapier.rs/)

---

**🚀 Ready to become the CODE CHAMPION?**

```bash
npm run dev
```

**May your syntax be flawless. 🌟**
