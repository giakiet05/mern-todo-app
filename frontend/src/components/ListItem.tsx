import { Dropdown, ListGroup } from 'react-bootstrap';
import { FaBars, FaEllipsisV } from 'react-icons/fa';
import List from '../models/list';
import { ListType } from './HomePageLoggedInView';

interface ListItemProps {
	list: List;
	currentListId?: string;
	onDeleteListBtnClicked: () => void;
	onRenameListBtnClicked: (list: List) => void;
	onListClicked: (listId: string) => void;
	setListType: (listType: ListType) => void;
}

export default function ListItem({
	list,
	currentListId,
	onDeleteListBtnClicked,
	onRenameListBtnClicked,
	onListClicked,
	setListType
}: ListItemProps) {
	return (
		<ListGroup.Item
			//as={Link}
			//to={`/${list._id}`}
			action
			className="d-flex align-items-center"
			onClick={() => {
				setListType(ListType.normal);
				onListClicked(list._id);
			}}
			style={
				currentListId === list._id
					? {
							borderLeft: '5px solid #0d6efd',
							paddingLeft: 11,
							boxSizing: 'border-box'
					  }
					: {}
			}
		>
			<FaBars className="me-2" />
			{list.name}

			<Dropdown
				className="ms-auto"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<Dropdown.Toggle
					id={`${list._id}-list`}
					className="no-caret no-color-dropdown-toggle"
				>
					<FaEllipsisV className="ms-auto" />
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item onClick={() => onRenameListBtnClicked(list)}>
						Rename list
					</Dropdown.Item>
					<Dropdown.Item
						onClick={onDeleteListBtnClicked}
						className="text-danger"
					>
						Delete list
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</ListGroup.Item>
	);
}
