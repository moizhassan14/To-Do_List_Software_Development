import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  setSearch,
  setSelectedTags,
} from "../../store/slice/task/task.slice";
import { RiSearch2Line } from "react-icons/ri";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const TaskFilterBar = () => {
  const dispatch = useDispatch();
  const { filter, search, selectedTags, tasks } = useSelector(
    (state) => state.task
  );

  const allTags = [...new Set(tasks.flatMap((task) => task.tags || []))];

  const toggleTag = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updated));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'active', 'completed'].map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none
              ${filter === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            onClick={() => dispatch(setFilter(type))}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <RiSearch2Line className="text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          placeholder="Search tasks..."
        />
      </div>

      {/* Tag Dropdown */}
      <div className="relative w-full sm:w-64">
        <Listbox value={selectedTags} onChange={() => {}} multiple>
          <div className="relative mt-1">
            <Listbox.Button className="w-full cursor-pointer rounded-md bg-gray-100 dark:bg-gray-800 py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-800 dark:text-gray-100">
              <span className="block truncate">
                {selectedTags.length > 0
                  ? selectedTags.join(", ")
                  : "Select Tags"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                {allTags.map((tag) => (
                  <Listbox.Option
                    key={tag}
                    value={tag}
                    as={Fragment}
                    onClick={() => toggleTag(tag)}
                  >
                    {({ active }) => (
                      <li
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors rounded-md
                          ${active
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-white'
                            : 'text-gray-800 dark:text-gray-200'}`}
                        style={{ listStyle: 'none' }}
                      >
                        <span className="truncate">{tag}</span>
                        {selectedTags.includes(tag) && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white dark:text-gray-900">
                            <CheckIcon className="w-4 h-4" />
                          </span>
                        )}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default TaskFilterBar;
