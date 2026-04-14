import { redirect } from 'next/navigation';

// /discover is handled by the tab UI on the home page.
// This route exists so that the BLUEPRINT-defined URL doesn't 404.
export default function DiscoverPage() {
  redirect('/');
}
