import { MainGame } from "@/features/main-game/MainGame";

// 应用首页：负责整体布局，将 three.js 主游戏居中展示
export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center font-sans">
      {/* three.js 的具体逻辑封装在 MainGame 中，这里只关心布局 */}
      <MainGame />
    </div>
  );
}
