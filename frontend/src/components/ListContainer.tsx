import { Dropdown, Stack } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import TaskItem from './TaskItem';
import List from '../models/list';
import Task from '../models/task';
import { useState } from 'react';
import ConfirmModal from './modals/ConfirmModal';
import { FilterType, ListType } from './HomePageLoggedInView';
import AddTaskForm from './AddTaskForm';
import { BsVariant } from '../types/enums';
interface ListContainerProps {
	list: List | null;
	tasks: Task[];
	filterType: FilterType;
	listType: ListType;
	onChecked: (listId: string, taskId: string, checked: boolean) => void;
	onSwitchIsImportant: (
		listId: string,
		taskId: string,
		checked: boolean
	) => void;
	onTaskClicked: (task: Task) => void;
	onDeleteListBtnClicked: (listId: string) => void;
	onRenameListBtnClicked: (list: List) => void;
	onDeleteAllTasksBtnClicked: (listId: string) => void;
	onCheckAllTasksBtnClicked: (listId: string) => void;
	onFilterClicked: (filterType: FilterType) => void;
	onTaskCreated: (newTask: Task) => void;
}

export default function ListContainer({
	list,
	tasks,
	listType,
	filterType,
	onChecked,
	onSwitchIsImportant,
	onTaskClicked,
	onDeleteListBtnClicked,
	onRenameListBtnClicked,
	onCheckAllTasksBtnClicked,
	onDeleteAllTasksBtnClicked,
	onFilterClicked,
	onTaskCreated
}: ListContainerProps) {
	let filterColor: string;
	switch (filterType) {
		case FilterType.All:
			filterColor = 'primary';
			break;
		case FilterType.Completed:
			filterColor = 'success';
			break;
		case FilterType.Incompleted:
			filterColor = 'secondary';
	}

	const [modalInfo, setModalInfo] = useState<{
		type: 'deleteTasks' | 'deleteList' | null;
		list: List | null;
	}>({
		type: null,
		list: null
	});

	function handleOpenModal(type: 'deleteTasks' | 'deleteList', list: List) {
		setModalInfo({ type, list });
	}

	function handleDeleteAction() {
		if (modalInfo.type === 'deleteTasks') {
			onDeleteAllTasksBtnClicked(modalInfo.list!._id);
		} else if (modalInfo.type === 'deleteList') {
			onDeleteListBtnClicked(modalInfo.list!._id);
		}
		setModalInfo({ type: null, list: null });
	}

	let listTitle: string;
	switch (listType) {
		case ListType.normal:
			listTitle = list?.name ?? '';
			break;
		case ListType.important:
			listTitle = 'Important';
			break;
		case ListType.search:
			listTitle = 'Search List';
			break;
	}

	const listOptionsDropdown = (
		<Dropdown className="ms-auto">
			<Dropdown.Toggle
				id="list-options-dropdown"
				variant="secondary"
				className="no-caret"
			>
				<FaBars />
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onClick={() => onRenameListBtnClicked(list!)}>
					Rename
				</Dropdown.Item>
				<Dropdown.Item onClick={() => onCheckAllTasksBtnClicked(list!._id)}>
					Check all tasks
				</Dropdown.Item>
				<Dropdown.Item
					className="text-danger"
					onClick={() => handleOpenModal('deleteTasks', list!)}
				>
					Delete all tasks
				</Dropdown.Item>
				<Dropdown.Item
					className="text-danger"
					onClick={() => handleOpenModal('deleteList', list!)}
				>
					Delete list
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);

	return (
		<div className="d-flex flex-column" style={{ height: '92vh' }}>
			<div className="mt-3 mx-3 d-flex align-items-center">
				<h1>{listTitle}</h1>

				{listType === ListType.normal && listOptionsDropdown}
			</div>

			<Dropdown className="ms-3 mt-0">
				<Dropdown.Toggle id="filter-dropdown" variant={filterColor} size="sm">
					{filterType}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item onClick={() => onFilterClicked(FilterType.All)}>
						All
					</Dropdown.Item>
					<Dropdown.Item onClick={() => onFilterClicked(FilterType.Completed)}>
						Completed
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => onFilterClicked(FilterType.Incompleted)}
					>
						Incompleted
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

			<Stack className="m-3 overflow-y-auto" gap={3} style={{ height: '67vh' }}>
				{tasks
					?.slice()
					.reverse()
					.map((task) => (
						<TaskItem
							key={task._id}
							task={task}
							onChecked={onChecked}
							onSwitchIsImportant={onSwitchIsImportant}
							onTaskClicked={onTaskClicked}
						/>
					))}
			</Stack>

			{listType === ListType.normal && (
				<AddTaskForm listId={list?._id} onTaskCreated={onTaskCreated} />
			)}

			{modalInfo.type && (
				<ConfirmModal
					title={
						modalInfo.type === 'deleteTasks'
							? `Delete all tasks of "${modalInfo.list?.name}" ?`
							: `Delete ${modalInfo.list?.name} ?`
					}
					description={
						modalInfo.type === 'deleteTasks'
							? `Are you sure you want to delete all tasks of the list "${modalInfo.list?.name}"?\nThey will be deleted permanently.`
							: `Are you sure you want to delete the list "${modalInfo.list?.name}"?\nThis action cannot be undone.`
					}
					confirmBtnType={BsVariant.danger}
					confirmBtnContent="Delete"
					onDismiss={() => setModalInfo({ type: null, list: null })}
					onConfirmed={handleDeleteAction}
				/>
			)}
		</div>
	);
}
