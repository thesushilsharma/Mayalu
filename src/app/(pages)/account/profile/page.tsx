import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">My Profile</h1>

    </div>
  );
}
