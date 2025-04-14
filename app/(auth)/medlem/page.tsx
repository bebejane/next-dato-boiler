import s from './page.module.scss';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/(auth)/api/auth/[...nextauth]/route';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) throw new Error('Unauthorized');
	return session;
};

export default async function AllCourses() {
	const session = await getSession();

	return (
		<>
			<article className={s.page}>
				<h1>Medlem</h1>
			</article>
		</>
	);
}
