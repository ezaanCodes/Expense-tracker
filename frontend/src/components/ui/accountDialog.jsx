import { MdMoreVert } from "react-icons/md";
import TransitionWrapper from "./wrappers/transition";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BiTransfer } from "react-icons/bi";
export default function AccountMenu({ addMoney, transferMoney }) {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600 dark:text-gray-300">
          <MdMoreVert />
        </MenuButton>

        <TransitionWrapper>
          <MenuItems className="absolute p-2 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg dark:bg-gray-900">
            <div className="px-1 py-1 space-y-2">
              <MenuItem>
                {() => (
                  <button
                    onClick={transferMoney}
                    className="group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-violet-700 transition-colors"
                  >
                    <BiTransfer />
                    Transfer Funds
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {() => (
                  <button
                    onClick={addMoney}
                    className="group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-violet-700 transition-colors"
                  >
                    <BiTransfer />
                    Add Funds
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </TransitionWrapper>
      </Menu>
    </>
  );
}
