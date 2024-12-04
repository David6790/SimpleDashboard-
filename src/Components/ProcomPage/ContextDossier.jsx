"use client";

import { useState } from "react";
import { Description, Field, Label, Switch } from "@headlessui/react";

const user = {
  name: "Debbie Lewis",
  handle: "deblewis",
  email: "debbielewis@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80",
};

export default function ContextDossier() {
  const [availableToHire, setAvailableToHire] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);

  return (
    <form
      action="#"
      method="POST"
      className="divide-y divide-gray-200 lg:col-span-9"
    >
      {/* Profile section */}
      <div className="px-4 py-6 sm:p-6 lg:pb-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row">
          <div className="grow space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-sky-600">
                  <div className="shrink-0 text-base text-gray-500">
                    workcation.com/
                  </div>
                  <input
                    defaultValue={user.handle}
                    id="username"
                    name="username"
                    type="text"
                    placeholder="janesmith"
                    className="block w-full grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-sky-600"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Write a few sentences about yourself.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* First Name */}
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-900"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-sky-600"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-sky-600"
              />
            </div>
          </div>

          {/* URL */}
          <div className="col-span-12">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-900"
            >
              URL
            </label>
            <div className="mt-2">
              <input
                id="url"
                name="url"
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-sky-600"
              />
            </div>
          </div>

          {/* Company */}
          <div className="col-span-12 sm:col-span-6">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-900"
            >
              Company
            </label>
            <div className="mt-2">
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-sky-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy section */}
      <div className="divide-y divide-gray-200 pt-6">
        <div className="px-4 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Privacy</h2>
          <p className="mt-1 text-sm text-gray-500">
            Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
          </p>
          <ul role="list" className="mt-2 divide-y divide-gray-200">
            {/* Available to Hire */}
            <Field as="li" className="flex items-center justify-between py-4">
              <div className="flex flex-col">
                <Label as="p" className="text-sm font-medium text-gray-900">
                  Available to hire
                </Label>
                <Description className="text-sm text-gray-500">
                  Nulla amet tempus sit accumsan. Aliquet turpis sed sit
                  lacinia.
                </Description>
              </div>
              <Switch
                checked={availableToHire}
                onChange={setAvailableToHire}
                className={`${
                  availableToHire ? "bg-teal-500" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${
                    availableToHire ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </Field>
            {/* Vous pouvez ajouter les autres champs ici en suivant le même modèle */}
          </ul>
        </div>
        <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
