import React, { useState } from 'react';
import './style.css';
import { Avatar, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import ConfirmationDialog from '../ConfirmationDialog';
import chatHttp from '../../services/Http';
import { useUser } from '../../context/UserContext';
import OkDialog from '../OkDialog';
import AddIcon from '@material-ui/icons/Add';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PersonIcon from '@material-ui/icons/Person';
import SubjectIcon from '@material-ui/icons/Subject';
import TranslateIcon from '@material-ui/icons/Translate';
import GroupIcon from '@material-ui/icons/Group';
import { RoomPopulated, RoomUserPopulated } from '../../types';
import AddUser from '../AddUser';

export interface RoomDetailsProps {
	roomDetails: RoomPopulated;
	onRoomLeave: (code: string) => void;
	onAddUser: (newUsers: RoomPopulated) => void;
}

function RoomDetails({ roomDetails, onRoomLeave, onAddUser }: RoomDetailsProps) {
	const [ openModal, setOpenModal ] = useState(false);
    const [ isSummarise, setIsSummarise ] = useState(false);
	const { code, description, users } = roomDetails;
	const [ isOpen, setIsOpen ] = useState(false);
	const [ content, setContent ] = useState('');
    const [ summarisedContent, setSummarisedContent ] = useState('');
	const [ type, setType ] = useState('Leave');
	const { userDetails } = useUser();
    const [ isTranslate, setIsTranslate ] = useState(false);
    const [translatedContent, setTranslatedContent] = useState('');


    const getSummarisedContent = async (roomCode: string) =>{
        // return "This is a summary of the chat"
		try {
			let { data } = await chatHttp.getSummary({ roomCode });
			if (data) {
				setSummarisedContent(data.summary);
			}
		} catch (e: any) {
			console.log(e.data);
			if (e?.data?.message) setSummarisedContent("An error happened, please try again later." + e.data.message);
			else setSummarisedContent("An error happened, please try again later.");
		}
    }

    const getTranslatedContent = () =>{ 
        return "This is a translation of the chat"
    }

	const openDialog = (type: string) => {
		setType(type);
		switch(type) {
			case 'Leave':
				setIsOpen(true);
				setContent(
					'You will not be able to receive messeges sent in this room anymore. Other users in the room will also be notified when you leave.'
				);
				break;
			case 'AddUser':
				setOpenModal(true);
				break;
            case 'Summarise':
				setSummarisedContent("Loading summary, please wait ...");
				setIsSummarise(true);
                getSummarisedContent(code);
                break;
            case 'Translate':
                // TODO: call API to get translation
                let translation = getTranslatedContent();
                setTranslatedContent(translation);
                setIsTranslate(true);
                break;
                
			default:
				setIsOpen(true);
				setContent('You will not be able to revert this deletion.');
		}
	};

	const handleModalClose = async (willProceed: boolean) => {
		try {
			setIsOpen(false);
			if (willProceed) {
				if (type === 'Leave') {
					await chatHttp.leaveRoom({ roomCode: code });
					onRoomLeave(code);
				} else {
					await chatHttp.deleteRoom({ roomCode: code });
				}
			}
		} catch (e: any) {
			console.log(e.response.data);
		}
	};

	const generateOptions = () => {
		const ROOM_OPTIONS = [
			// { label: 'Change Group Photo', icon: <PhotoIcon />, adminOnly: false },
			{ label: 'Add User', icon: <AddIcon />, adminOnly: false, action: () => openDialog('AddUser')  },
			{ label: 'Leave Room', icon: <MeetingRoomIcon />, adminOnly: false, action: () => openDialog('Leave') },
            { label: 'Summarise', icon: <SubjectIcon/>, adminOnly: false, action:()=> openDialog('Summarise')},
            { label: 'Translate', icon: <TranslateIcon />, adminOnly: false, action: () => openDialog('Translate')}
			// { label: 'Delete Group', icon: <DeleteIcon />, adminOnly: true, action: () => openDialog('Delete') }
		];
		return ROOM_OPTIONS.map(({ label, icon, adminOnly, action }, i) => {
			return (
				(!adminOnly || (adminOnly && users[0].user.username === userDetails.username)) && (
					<ListItem key={i} button onClick={action}>
						<ListItemIcon>{icon}</ListItemIcon>
						<ListItemText primary={label} />
					</ListItem>
				)
			);
		});
	};

	const generateUserList = () => {
		return users.map(({ user }: RoomUserPopulated) => {
			const { username, displayName } = user;
			return (
				<ListItem key={username}>
					<ListItemAvatar>
						<Avatar>{displayName ? displayName.charAt(0) + displayName.charAt(1) : <PersonIcon />}</Avatar>
					</ListItemAvatar>
					<ListItemText primary={`${displayName}`} secondary={username} />
				</ListItem>
			);
		});
	};

	const handleAddUserClose = (room: RoomPopulated | null) => {
		if (room) {
			onAddUser(room);
		}
		setOpenModal(false);
	};

    const handleCloseSummary = () =>{
        setIsSummarise(false);
    }

    const handleCloseTranslation = () => {
        setIsTranslate(false);
    }

	return (
		<div className="room__details">
			<Avatar className="avatar--large">
				<GroupIcon />
			</Avatar>
			<h1>{code}</h1>
			<p>{description}</p>
			<List>{generateOptions()}</List>
			<List>{generateUserList()}</List>

			<ConfirmationDialog open={isOpen} onClose={handleModalClose} content={content} />
			<AddUser open={openModal} roomCode={code} onClose={handleAddUserClose} />
            <OkDialog title={"Chat Summary"} open={isSummarise} content={summarisedContent} onClose={handleCloseSummary} />
            <OkDialog title={"Translated Chat"} open={isTranslate} content={translatedContent} onClose={handleCloseTranslation} />
		</div>
	);
}

export default RoomDetails;
