import ListContainer from './ListContainer';
import List from '../models/list';
import SideBar from './SideBar';
import EditTaskSideBar from './EditTaskSideBar';
import { useEffect, useState } from 'react';
import * as ListApi from '../network/listApi';
import AddEditListModal from './AddEditListModal';
import * as TaskApi from '../network/taskApi';
import Task from '../models/task';
import WelcomeView from './WelcomeView';
import AddTaskForm from './AddTaskForm';
import ImportantList from './ImportantList';
import SearchList from './SearchList';
import { Spinner } from 'react-bootstrap';

export default function HomePageLoggedInView() {
	const [lists, setLists] = useState<List[]>([]);
	const [currentList, setCurrentList] = useState<List | null>(null);
	const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
	const [showAddListModal, setShowAddListModal] = useState(false);
	const [listToEdit, setListToEdit] = useState<List | null>(null);
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
	const [showImportantList, setShowImportantList] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showLoadingError, setShowLoadingError] = useState(false);
	const [showSearchList, setShowSearchList] = useState(false);
	async function loadCurrentList(listId: string) {
		try {
			setLoading(true);
			const list = await ListApi.getList(listId);
			setCurrentList(list);
			setShowImportantList(false);
			setShowSearchList(false);
			await loadCurrentTasks(listId); // Load tasks immediately after setting the current list
		} catch (error) {
			alert(error);
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
			alert(error);
			console.log(error);
		}
	}

	async function loadImportantTasks() {
		try {
			setLoading(true);
			const importantTasks = await TaskApi.getImportantTasks();
			setShowImportantList(true);
			setCurrentList(null);
			setShowSearchList(false);
			setCurrentTasks(importantTasks);
		} catch (error) {
			alert(error);
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
			setShowSearchList(true);
			setCurrentList(null);
			setShowImportantList(false);
			setCurrentTasks(searchedTasks);
		} catch (error) {
			setShowLoadingError(true);
			alert(error);
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		async function loadLists() {
			try {
				const lists = await ListApi.getLists();
				setLists(lists);
			} catch (error) {
				alert(error);
				console.log(error);
			}
		}

		loadLists();
	}, []);

	function handleListClicked(listId: string) {
		setTaskToEdit(null);

		loadCurrentList(listId);
	}

	async function handleDeleteList(listId: string) {
		try {
			await ListApi.deleteList(listId);
			setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
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

	let currentView;
	if (showImportantList)
		currentView = (
			<ImportantList
				tasks={currentTasks}
				onChecked={handleChecked}
				onSwitchIsImportant={handleSwitchIsImportant}
				onTaskClicked={handleTaskClicked}
			/>
		);
	else if (showSearchList)
		currentView = (
			<SearchList
				tasks={currentTasks}
				onChecked={handleChecked}
				onSwitchIsImportant={handleSwitchIsImportant}
				onTaskClicked={handleTaskClicked}
			/>
		);
	else if (currentList)
		currentView = (
			<>
				<ListContainer
					list={currentList}
					tasks={currentTasks}
					onChecked={handleChecked}
					onSwitchIsImportant={handleSwitchIsImportant}
					onTaskClicked={handleTaskClicked}
					onDeleteListBtnClicked={handleDeleteList}
					onRenameListBtnClicked={setListToEdit}
					onCheckAllTasksBtnClicked={handleCheckAllTasks}
					onDeleteAllTasksBtnClicked={handleDeleteAllTasks}
				/>

				<AddTaskForm
					listId={currentList?._id}
					onTaskCreated={handleTaskCreated}
				/>
			</>
		);
	else currentView = <WelcomeView />;
	return (
		<div className="d-flex" style={{ marginTop: 50, marginBottom: -20 }}>
			<SideBar
				lists={lists}
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
					<p className="text-center">
						Something went wrong. Please refresh the page.
					</p>
				)}
				{!loading && !showLoadingError && currentView}
			</div>

			{showAddListModal && (
				<AddEditListModal
					onDismiss={() => setShowAddListModal(false)}
					onListSaved={(newList) => {
						setShowAddListModal(false);
						setLists((prev) => [...prev, newList]);
						loadCurrentList(newList._id);
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
