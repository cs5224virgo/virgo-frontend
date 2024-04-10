import React, { useState, useRef } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { Button } from '@material-ui/core';
import chatHttp from '../../services/Http';
import './style.css';
import { useHistory } from 'react-router-dom';

export interface SignUpProps {
	history: ReturnType<typeof useHistory>;
}

function SignUp({ history }: SignUpProps) {
	const [ username, setUsername ] = useState('');
	const [ isUsernameAvailable, setIsUsernameAvailable ] = useState(true);
	const displayNameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [ errorMsg, setErrorMsg ] = useState('');

	const proceed = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (canProceed() && passwordRef.current) {
			setErrorMsg('');
			chatHttp
				.register({
					username,
					displayName: displayNameRef.current ? displayNameRef.current.value : '',
					password: passwordRef.current.value
				})
				.then(({ success }) => {
					if (success) history.push('/login');
				})
				.catch(({ response }) => {
					console.log(response.data);
				});
		} else {
			setErrorMsg('Fill-in all required fields');
		}
	};

	const checkAvailability = async (username: string) => {
		setUsername(username);
		chatHttp
			.checkAvailability({ username })
			.then((resp) => {
				setIsUsernameAvailable(resp.isAvailable);
			})
			.catch(({ response }) => {
				console.log(response.data);
			});
	};

	const canProceed = () => {
		return (
			username &&
			isUsernameAvailable &&
			passwordRef.current &&
			passwordRef.current.value
		);
	};

	return (
		<div className="signup auth__wrapper">
			<div className="signup__area area__wrapper">
				<form>
					<DebounceInput
						debounceTimeout={300}
						onChange={(e) => checkAvailability(e.target.value)}
						value={username}
						type="text"
						placeholder="Username"
						required
					/>
					{username &&
					!isUsernameAvailable && (
						<strong className="error__msg">{username} already taken, please try another username.</strong>
					)}
					<input ref={passwordRef} type="password" placeholder="Password" required />
					<div className="signup__name">
						<input ref={displayNameRef} type="text" placeholder="Display Name (optional)" />
					</div>

					<Button
						onClick={proceed}
						type="submit"
						className="secondary"
						variant="contained"
						color="primary"
						size="large"
					>
						Register
					</Button>
				</form>
				{errorMsg && <strong className="error__msg">{errorMsg}</strong>}
			</div>
		</div>
	);
}

export default SignUp;
