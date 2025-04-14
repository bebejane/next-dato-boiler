'use server';

import s from './page.module.scss';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<>
			<div className={s.form}>
				<LoginForm />
			</div>
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
