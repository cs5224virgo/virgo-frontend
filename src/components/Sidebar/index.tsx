import React, { useEffect, useState } from 'react';
import './style.css';
import SidebarRoom from '../SidebarRooms';
import { useHistory } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';
import { RoomPopulated } from '../../types';
import SidebarHeader from '../SidebarHeader';
import { useUser } from '../../context/UserContext';

export interface SidebarProps {
	history: ReturnType<typeof useHistory>;
	rooms: RoomPopulated[];
	onNewRoom: () => void;
	onRoomClick: (code: string) => void;
}

const Sidebar = ({ onNewRoom, rooms, history, onRoomClick }: SidebarProps) => {
	const { userDetails } = useUser();
	const [ sortedRooms, setSortedRooms ] = useState([] as RoomPopulated[]);
	
	useEffect(
		() => {
			setSortedRooms(() => {
				return rooms.sort((a,b) => {
					const dateA = new Date(a.lastActivity? a.lastActivity : a.createdAt).getTime();
					const dateB = new Date(b.lastActivity? b.lastActivity : b.createdAt).getTime();
					return dateB - dateA;
				});
			});
		},
		[ rooms ]
	);

	return (
		<div className="sidebar">
			<SidebarHeader onNewRoom={onNewRoom} history={history} />

			{/* TODO future implementation */}
			{/* <div className="sidebar__search">
				<div className="sidebar__searchContainer">
					<SearchIcon />
					<input type="text" placeholder="Search or start new chat" />
				</div>
			</div> */}

			<div className="sidebar__rooms">
				<Scrollbar className="sidebar__scrollbar">
					{sortedRooms.map((room: RoomPopulated, i: number) => (
						<SidebarRoom key={i} room={room} userDetails={userDetails} onRoomClick={onRoomClick} />
					))}
				</Scrollbar>
			</div>
		</div>
	);
};

export default Sidebar;
