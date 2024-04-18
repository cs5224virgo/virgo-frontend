import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import chatHttp from '../../services/Http';
import './style.css';
import { RoomPopulated } from '../../types';

export interface AddUserProps {
	open: boolean;
	roomCode: string;
	onClose: (value: null | RoomPopulated) => void;
}

function AddUser({ open, roomCode, onClose }: AddUserProps) {
	const [ username, setUsername ] = useState('');
	const [ errorMsg, setErrorMsg ] = useState('');

	const handleClose = (val: null | RoomPopulated) => {
		onClose(val);
	};

	const proceed = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setErrorMsg('');
		if (username) {
			try {
				let { data } = await chatHttp.addUser({ username, roomCode });
				if (data) {
					setUsername('');
					handleClose(data.room);
				}
			} catch (e: any) {
				console.log(e.data);
				if (e?.data?.message) setErrorMsg(e.data.message);
			}
		}
	};

	return (
		<Dialog onClose={() => handleClose(null)} aria-labelledby="new-room-dialog" open={open} className="newRoom">
			<DialogTitle id="add-user-dialog">Add user(s) to chatroom</DialogTitle>
			<DialogContent className="addUser__content">
				<form>
					<input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="username1, username2, ..." />
					{errorMsg && <strong className="error__msg">{errorMsg}</strong>}
					<Button
						onClick={proceed}
						type="submit"
						className="secondary"
						variant="contained"
						color="primary"
						size="large"
					>
						Add User(s)
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddUser;
