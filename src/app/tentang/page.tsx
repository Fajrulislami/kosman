import HeroAbout from "@/components/about/HeroAbout";
import Story from "@/components/about/Story";
import Values from "@/components/about/Values";
import Advantages from "@/components/about/Advantages";
import Environment from "@/components/about/Environment";
import TargetAudience from "@/components/about/TargetAudience";
import CtaAbout from "@/components/about/CtaAbout";



export const metadata = {
  title: "Tentang Kami | Pondok Rahmat",
  description: "Mengenal lebih dekat Pondok Rahmat, hunian premium yang dirancang untuk kenyamanan Anda.",
};

export default function TentangPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroAbout />

      <Story />
      
      <Values />

      <Advantages />

      <Environment />

      <TargetAudience />

      <CtaAbout />

     

      {/* Section lain untuk halaman Tentang akan kita tambahkan di sini nanti */}
      
    </main>
  );
}