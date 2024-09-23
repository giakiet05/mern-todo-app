import { FaSearch, FaStar } from 'react-icons/fa';
import { Button, ListGroup, InputGroup, Form } from 'react-bootstrap';
import List from '../models/list';
import ListItem from './ListItem';
import { ChangeEvent, useState } from 'react';
interface SideBarProps {
	lists: List[];
	currentListId?: string;
	onImportantListClicked: () => void;
	onAddListBtnClicked: () => void;
	onDeleteListBtnClicked: (listId: string) => void;
	onRenameListBtnClicked: (list: List) => void;
	onListClicked: (listId: string) => void;
	onSearch: (query: string) => void;
}

export default function SideBar({
	lists,
	currentListId,
	onAddListBtnClicked,
	onDeleteListBtnClicked,
	onRenameListBtnClicked,
	onListClicked,
	onImportantListClicked,
	onSearch
}: SideBarProps) {
	const [query, setQuery] = useState('');

	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		const newQuery = e.target.value;
		setQuery(newQuery);
		onSearch(newQuery);
	}

	return (
		<div
			className="d-flex flex-column"
			style={{
				height: '92vh',
				minWidth: '300px',
				borderRight: '1px solid #333'
			}}
		>
			<InputGroup className="my-4 mx-auto" style={{ width: '90%' }}>
				<Form.Control
					value={query}
					onChange={handleSearchChange}
					placeholder="Search"
					aria-label="Search"
					className="rounded-pill border-black ps-5"
				/>
				<FaSearch
					style={{
						position: 'absolute',
						left: '15px',
						top: '50%',
						transform: 'translateY(-50%)',
						color: '#888'
					}}
				/>
			</InputGroup>
			<ListGroup variant="flush" className="px-4">
				<ListGroup.Item
					action
					className="d-flex align-items-center"
					onClick={onImportantListClicked}
				>
					<FaStar className="me-2" />
					Important
				</ListGroup.Item>
			</ListGroup>
			<hr />
			<ListGroup
				variant="flush"
				className="px-4 overflow-y-auto"
				style={{ height: '55vh' }}
			>
				{lists.map((list) => (
					<ListItem
						key={list._id}
						list={list}
						currentListId={currentListId}
						onDeleteListBtnClicked={onDeleteListBtnClicked}
						onRenameListBtnClicked={onRenameListBtnClicked}
						onListClicked={onListClicked}
					/>
				))}
			</ListGroup>
			<Button
				variant="primary"
				className="mt-auto mb-4 mx-auto"
				style={{ width: '90%' }}
				onClick={onAddListBtnClicked}
			>
				New List
			</Button>
		</div>
	);
}
