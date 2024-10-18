import { FaSearch, FaStar } from 'react-icons/fa';
import { Button, ListGroup, InputGroup, Form } from 'react-bootstrap';
import List from '../models/list';
import ListItem from './ListItem';
import { ChangeEvent, useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { Link, useNavigate } from 'react-router-dom';
import { ListType } from './HomePageLoggedInView';
interface SideBarProps {
	lists: List[];
	currentListId?: string;
	setListType: (listType: ListType) => void;
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
	onSearch,
	setListType
}: SideBarProps) {
	const [query, setQuery] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [listToDelete, setListToDelete] = useState<List | null>(null);

	//const navigate = useNavigate();

	function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
		const newQuery = e.target.value;
		setQuery(newQuery);
		onSearch(newQuery);
		setListType(ListType.search);
	}

	function handleOpenModal(list: List) {
		setShowModal(true);
		setListToDelete(list);
	}

	function handleDeleteList(listId: string) {
		onDeleteListBtnClicked(listId);
		setShowModal(false);
		setListToDelete(null);
	}
	return (
		<div
			className="d-flex flex-column"
			style={{
				height: '92vh',
				width: '300px',
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
					onClick={() => {
						setListType(ListType.important);
						onImportantListClicked();
					}}
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
						setListType={setListType}
						currentListId={currentListId}
						onDeleteListBtnClicked={() => handleOpenModal(list)}
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

			{showModal && (
				<ConfirmModal
					title={`Delete ${listToDelete?.name} ? `}
					description={`Are you sure you want to delete the list "${listToDelete?.name}"?`}
					action="Delete"
					onDismiss={() => setShowModal(false)}
					onConfirmed={() => handleDeleteList(listToDelete!._id)}
				/>
			)}
		</div>
	);
}
