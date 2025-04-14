import s from './page.module.scss';
import LogoutForm from './LogoutForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<div className={s.form}>
			<LogoutForm />
		</div>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
