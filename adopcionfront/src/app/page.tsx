import HeroSection from '@/components/Hero-Section'
import PetList from '@/components/Pet-List'
import Dashboard from '@/components/Dashboard'
export default function HomePage() {
  return (
    <div className="">
      <main>
        <HeroSection />
        <PetList />
      </main>
    </div>
  );
}
