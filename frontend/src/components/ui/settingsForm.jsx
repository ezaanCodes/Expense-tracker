import React, { Fragment, useEffect, useState } from "react";
import useStore from "../../store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../../libs/apiCall";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { BiCheck, BiLoader } from "react-icons/bi";
import { fetchCountries } from "../../libs";
import Input from "./input";
import { Button } from "./button";

const SettingsForm = () => {
  const { user, theme, setTheme } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...user },
  });

  const [selectedCountry, setSelectedCountry] = useState(
    // eslint-disable-next-line no-constant-binary-expression
    { country: user?.country, currency: user?.currency } || ""
  );
  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const newData = {
        ...values,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      console.log("Form Data:", newData); // <-- check if firstname, lastname, email are present
      const { data: res } = await api.put(`/user/${user?.id}`, newData);

      if (res?.user) {
        const newUser = { ...res.user, token: user?.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res.message);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
    document.documentElement.classList.toggle("dark", val === "dark");
  };

  const filteredCountries =
    query === ""
      ? countriesData
      : countriesData.filter((country) =>
          country.country
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };
  useEffect(() => {
    getCountriesList();
  }, []);

  const Countries = () => {
    return (
      <div className=" w-full">
        <Combobox value={selectedCountry} onChange={setSelectedCountry}>
          <div className="relative mt-1">
            <div>
              <ComboboxInput
                className="inputStyles"
                displayValue={(country) => country?.country}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <BsChevronExpand className="text-gray-800 dark:text-gray-400" />
              </ComboboxButton>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-4  text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ">
                {filteredCountries.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-200 dark:text-gray-500">
                    Nothing Found
                  </div>
                ) : (
                  filteredCountries?.map((country, index) => (
                    <ComboboxOption
                      key={country.country + index}
                      className={({ active }) => {
                        `relative cursor-default select-none py-2 pl-10 pr-4${
                          active
                            ? "bg-violet-600/20 text-white"
                            : "text-gray-900"
                        }
                                                    `;
                      }}
                      value={country}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={country?.flag}
                              alt={country?.country}
                              className="w-8 h-5 rounded-sm object-cover"
                            />
                            <span
                              className={`block truncate text-gray-700 dark:text-gray-500 ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {country?.country}
                            </span>
                          </div>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <BiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center md:flex-row justify-between gap-4">
        <div className="w-full">
          <Input
            name="firstname"
            label="First Name"
            placeholder="John"
            error={errors.firstname ? errors.firstname.message : ""}
            {...register("firstname", { required: "First name is required" })}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
        <div className="w-full">
          <Input
            name="lastname"
            label="Last Name"
            placeholder="Doe"
            error={errors.lastname ? errors.lastname.message : ""}
            {...register("lastname", { required: "Last name is required" })}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-between gap-4 my-4">
        <div className="w-full">
          <Input
            disabled={loading}
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="test@example.com"
            error={errors.email ? errors.email.message : ""}
            {...register("email")}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
          placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            id="contact"
            // name="Email"
            label="Contact Number"
            type="text"
            placeholder="123456789"
            error={errors.contact?.message}
            {...register("contact")}
            className="text-sm border dark:border-gray-800 dark:bg-transparent dark:
            placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-between gap-4 my-4">
        <div className="w-full">
          <span className="labelStyles">Country</span>
          <Countries />
        </div>
        <div className="w-full">
          <span className="labelStyles">Currency</span>
          <select className="inputStyles">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-between gap-4 my-4">
        <div className="w-full flex items-center justify-between pt-10">
          <div className="space-y-1">
            <p className="text-lg text-black dark:text-gray-400 font-semibold">
              Appearance
            </p>
            <span className="labelStyles">
              Customize how your theme looks on your device.
            </span>
          </div>
          <div className="w-28 md:w-40">
            <select
              className="inputStyles"
              defaultValue={theme}
              onChange={(e) => toggleTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-between gap-4 my-4">
        <div className="w-full flex items-center justify-between pt-10">
          <div className="space-y-1">
            <p className="text-lg text-black dark:text-gray-400 font-semibold">
              Language
            </p>
            <span className="labelStyles">
              Customize what language you want (feature comming soon).
            </span>
          </div>
          <div className="w-28 md:w-40">
            <select className="inputStyles">
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-end gap-4 my-4">
        <Button
          variant="outline"
          loading={loading}
          type="reset"
          className="px-6 bg-transparent text-black dark:text-white-border border-gray-200 dark:border-gray-700"
        >
          Reset
        </Button>

        <Button
          loading={loading}
          type="submit"
          className="px-8 bg-violet-800 text-white"
        >
          {loading ? <BiLoader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
