/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import ListContainer from './ListContainer';
import List from '../models/list';
import SideBar from './SideBar';
import EditTaskSideBar from './EditTaskSideBar';
import { useEffect, useState } from 'react';
import * as ListApi from '../network/listApi';
import AddEditListModal from './modals/AddEditListModal';
import * as TaskApi from '../network/taskApi';
import Task from '../models/task';
import WelcomeView from './WelcomeView';
import { Spinner } from 'react-bootstrap';

export enum FilterType {
	All = 'All',
	Completed = 'Completed',
	Incompleted = 'Incompleted'
}

export enum ListType {
	normal,
	important,
	search
}

export default function HomePageLoggedInView() {
	const [lists, setLists] = useState<List[]>([]);
	const [currentList, setCurrentList] = useState<List | null>(null);
	const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
	const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
	const [showAddListModal, setShowAddListModal] = useState(false);
	const [listToEdit, setListToEdit] = useState<List | null>(null);
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
	const [showImportantList, setShowImportantList] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showLoadingError, setShowLoadingError] = useState(false);
	const [listType, setListType] = useState<ListType>(ListType.normal);

	//const navigate = useNavigate();

	async function loadCurrentList(listId: string) {
		try {
			setLoading(true);
			const list = await ListApi.getList(listId);
			storeCurrentListId(listId);
			setCurrentList(list);
			setShowImportantList(false);
			await loadCurrentTasks(listId); // Load tasks immediately after setting the current list
		} catch (error) {
			console.log(error);
			setShowLoadingError(true);
		} finally {
			setLoading(false);
		}
	}

	async function loadCurrentTasks(listId: string) {
		try {
			const tasks = await TaskApi.getTasks(listId);
			setCurrentTasks(tasks);
		} catch (error) {
			console.log(error);
			setShowLoadingError(true);
		}
	}

	async function loadImportantTasks() {
		try {
			setLoading(true);
			const importantTasks = await TaskApi.getImportantTasks();
			setShowImportantList(true);
			setCurrentList(null);
			setCurrentTasks(importantTasks);
		} catch (error) {
			console.log(error);
			setShowLoadingError(true);
		} finally {
			setLoading(false);
		}
	}

	async function loadSearchedTasks(query: string) {
		try {
			setLoading(true);
			const searchedTasks = await TaskApi.searchTasks(query);
			setCurrentList(null);
			setShowImportantList(false);
			setCurrentTasks(searchedTasks);
		} catch (error) {
			setShowLoadingError(true);
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	function storeCurrentListId(listId: string) {
		localStorage.setItem('CURRENT_LIST', listId); // Store the list ID as a string
	}

	function deleteCurrentListId() {
		localStorage.removeItem('CURRENT_LIST');
	}

	function getCurrentListId() {
		const listId = localStorage.getItem('CURRENT_LIST'); // Get the list ID from localStorage
		return listId ?? undefined; // Return the list ID or undefined if it doesn't exist
	}

	useEffect(() => {
		async function loadLists() {
			try {
				const lists = await ListApi.getLists();
				console.log(lists);
				setLists(lists);

				// Get the current list ID from local storage
				const currentListId =
					getCurrentListId() || (lists.length > 0 ? lists[0]._id : null);

				// Load the current list only if a valid ID is found
				if (currentListId) await loadCurrentList(currentListId);
			} catch (error) {
				alert(error);
				console.log(error);
			}
		}

		loadLists();
	}, []);

	function handleListClicked(listId: string) {
		setTaskToEdit(null);
		console.log(currentList?._id);
		loadCurrentList(listId);
	}

	async function handleDeleteList(listId: string) {
		try {
			setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
			const currentListId = getCurrentListId();
			if (currentListId === listId) deleteCurrentListId();
			await ListApi.deleteList(listId);
			if (listId === currentList?._id) setCurrentList(null);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	async function handleChecked(
		listId: string,
		taskId: string,
		checked: boolean
	) {
		try {
			setCurrentTasks((prevTasks) => {
				const updatedTasks = prevTasks.map((task) => {
					if (task._id === taskId) {
						const updatedTask = {
							...task,
							checked,
							completedAt: checked ? new Date().toISOString() : undefined
						};

						return updatedTask;
					} else return task;
				});

				if (taskToEdit && taskToEdit._id === taskId) {
					setTaskToEdit((prevTask) => {
						if (prevTask) {
							return {
								...prevTask,
								checked,
								completedAt: checked ? new Date().toISOString() : undefined
							};
						} else return prevTask;
					});
				}

				return updatedTasks;
			});

			await TaskApi.checkTask(listId, taskId, checked);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	async function handleSwitchIsImportant(
		listId: string,
		taskId: string,
		isImportant: boolean
	) {
		try {
			setCurrentTasks((prevTasks) => {
				const updatedTasks = prevTasks
					.map((task) => {
						// If currently viewing important tasks and task is being marked as not important, skip it
						if (showImportantList && !isImportant) {
							return null; // Indicate that this task should be removed
						}
						// Otherwise, return the updated task
						return task._id === taskId ? { ...task, isImportant } : task;
					})
					.filter((task) => task !== null); // Remove any null entries from the array

				if (taskToEdit && taskToEdit._id === taskId) {
					setTaskToEdit((prevTask) =>
						prevTask ? { ...prevTask, isImportant } : prevTask
					);
				}
				return updatedTasks;
			});

			await TaskApi.updateImportantTask(listId, taskId, isImportant);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	function handleTaskCreated(newTask: Task) {
		setCurrentTasks((prevTasks) => [...prevTasks, newTask]);
	}

	function handleTaskClicked(task: Task) {
		if (!task || taskToEdit?._id !== task._id) {
			setTaskToEdit(task);
		} else setTaskToEdit(null);
	}

	function handleTaskSaved(updatedTask: Task) {
		setTaskToEdit(null);
		setCurrentTasks((prevTasks) =>
			prevTasks.map((task) =>
				task._id === updatedTask._id ? updatedTask : task
			)
		);
	}
	async function handleDeleteTask(listId: string, taskId: string) {
		try {
			await TaskApi.deleteTask(listId, taskId);
			setTaskToEdit(null);
			setCurrentTasks((prevTasks) => {
				return prevTasks.filter((task) => task._id !== taskId);
			});
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	async function handleDeleteAllTasks(listId: string) {
		try {
			setCurrentTasks([]);
			await TaskApi.deleteAllTasks(listId);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	async function handleCheckAllTasks(listId: string) {
		try {
			setCurrentTasks((prevTasks) => {
				const isAllChecked = prevTasks.every((task) => task.checked);
				const updatedTasks = prevTasks.map((task) => {
					const updatedTask = {
						...task,
						checked: !isAllChecked,
						completedAt: !isAllChecked ? new Date().toISOString() : undefined
					};

					// If the EditTaskSideBar is open for this task, update it as well
					if (taskToEdit && taskToEdit._id === task._id) {
						setTaskToEdit((prevTask) => {
							if (prevTask) {
								return {
									...prevTask,
									checked: !isAllChecked,
									completedAt: !isAllChecked
										? new Date().toISOString()
										: undefined
								};
							} else return prevTask;
						});
					}

					return updatedTask;
				});
				return updatedTasks;
			});
			await TaskApi.checkAllTasks(listId);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	function filterTasks(tasks: Task[]) {
		let filteredTasks: Task[];
		switch (filterType) {
			case FilterType.All:
				filteredTasks = tasks;
				break;
			case FilterType.Completed:
				filteredTasks = tasks.filter((task) => task.checked === true);
				break;
			case FilterType.Incompleted:
				filteredTasks = tasks.filter((task) => task.checked === false);
				break;
		}
		return filteredTasks;
	}

	return (
		<div className="d-flex" style={{ marginTop: 50, marginBottom: -20 }}>
			<SideBar
				lists={lists}
				setListType={setListType}
				currentListId={currentList?._id}
				onAddListBtnClicked={() => setShowAddListModal(true)}
				onDeleteListBtnClicked={handleDeleteList}
				onRenameListBtnClicked={setListToEdit}
				onListClicked={handleListClicked}
				onImportantListClicked={() => loadImportantTasks()}
				onSearch={loadSearchedTasks}
			/>
			<div className="flex-grow-1 d-flex flex-column">
				{loading && (
					<Spinner
						animation="border"
						variant="primary"
						className="mx-auto mt-4"
					/>
				)}
				{showLoadingError && (
					<p className="text-center mt-3 text-danger">
						Something went wrong. Please refresh the page.
					</p>
				)}
				{!loading && !showLoadingError && (
					<>
						{/* If currentList is null (3 case: in search list, in important list or not in any list), then check for listtype, if it is null, render welcomeview */}
						{currentList ||
						listType === ListType.important ||
						listType === ListType.search ? (
							<ListContainer
								list={currentList}
								tasks={filterTasks(currentTasks)}
								filterType={filterType}
								listType={listType}
								onChecked={handleChecked}
								onSwitchIsImportant={handleSwitchIsImportant}
								onTaskClicked={handleTaskClicked}
								onDeleteListBtnClicked={handleDeleteList}
								onRenameListBtnClicked={setListToEdit}
								onCheckAllTasksBtnClicked={handleCheckAllTasks}
								onDeleteAllTasksBtnClicked={handleDeleteAllTasks}
								onFilterClicked={setFilterType}
								onTaskCreated={handleTaskCreated}
							/>
						) : (
							<WelcomeView />
						)}
					</>
				)}
			</div>

			{showAddListModal && (
				<AddEditListModal
					onDismiss={() => setShowAddListModal(false)}
					onListSaved={(newList) => {
						setShowAddListModal(false);
						setLists((prev) => [...prev, newList]);
						loadCurrentList(newList._id);
						//navigate(`/${newList?._id}`);
					}}
				/>
			)}
			{listToEdit && (
				<AddEditListModal
					onDismiss={() => {
						setListToEdit(null);
					}}
					onListSaved={(updatedList) => {
						setListToEdit(null);
						setLists(
							lists.map((list) =>
								list._id === updatedList._id ? updatedList : list
							)
						);
						loadCurrentList(updatedList._id);
						//navigate(`/${updatedList?._id}`);
					}}
					listToEdit={listToEdit}
				/>
			)}

			{taskToEdit && (
				<EditTaskSideBar
					task={taskToEdit}
					onDismiss={() => setTaskToEdit(null)}
					onTaskSaved={handleTaskSaved}
					onSwitchIsImportant={handleSwitchIsImportant}
					onDeleteTaskBtnClicked={handleDeleteTask}
				/>
			)}
		</div>
	);
}
