import HomePageLoggedInView from '../components/HomePageLoggedInView';
import HomePageLoggedOutView from '../components/HomePageLoggedOutView';
import User from '../models/user';

interface HomePageProps {
	loggedInUser: User | null;
}

export default function HomePage({ loggedInUser }: HomePageProps) {
	return (
		<>{loggedInUser ? <HomePageLoggedInView /> : <HomePageLoggedOutView />}</>
	);
}
