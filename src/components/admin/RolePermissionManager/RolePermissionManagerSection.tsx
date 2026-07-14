"use client";

import { useEffect, useMemo, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { getRoles, updateRolePermissions } from "@/services/role.service";
import { getModules } from "@/services/module.service";

/*  ========================================================
                        TYPES
    ========================================================= */

type PermissionAction = | "visible" | "read" | "write" | "update" | "delete";

interface Permission {
    visible: boolean;
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
}

interface ModulePermission {
    moduleId: string;
    moduleName: string;
    permissions: Permission;
}

interface Role {
    _id: string;
    roleName: string;
}



/*  ========================================================
                DUMMY ROLE PERMISSIONS
    ========================================================= */

const defaultPermission = (): Permission => ({
    visible: false,
    read: false,
    write: false,
    update: false,
    delete: false,
});



/*  ========================================================
                        COMPONENT
    ========================================================= */

export default function RolePermissionManager() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [modulesList, setModulesList] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState("");

    /*  ========================================================
                         HELPERS
    ========================================================= */



    const createDefaultPermissions = (): ModulePermission[] =>
        modulesList.map((module) => ({
            moduleId: module._id,
            moduleName: module.moduleName,
            permissions: defaultPermission(),
        }));

    const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>(createDefaultPermissions());


    const fetchRoles = async () => {
        try {
            const res: any = await getRoles();
            const data = Array.isArray(res) ? res : res || [];
            setRoles(data);
        } catch (err) {
            console.log(err);
        }

    }

    const fetchModules = async () => {
        try {
            const res: any = await getModules();
            const data = Array.isArray(res) ? res : res || [];
            setModulesList(data);
        } catch (err) {
            console.log(err);
        }

    }


    useEffect(() => {
        fetchRoles()
        fetchModules()
    }, []);


    /* =========================================================
       LOAD ROLE PERMISSIONS
    ========================================================= */

    const handleRoleChange = (roleId: string) => {
        setSelectedRole(roleId);

        const role: any = roles.find((r: any) => r._id === roleId);

        // Role not found
        if (!role) {
            setModulePermissions(createDefaultPermissions());
            return;
        }

        // No permissions assigned to this role
        if (!role.permissions || role.permissions.length === 0) {
            setModulePermissions(createDefaultPermissions());
            return;
        }

        const defaultPermissions = createDefaultPermissions();

        const mergedPermissions = defaultPermissions.map((module: any) => {
            const permission = role.permissions.find(
                (p: any) =>
                    p.module.toString() === module.moduleId.toString()
            );

            if (permission) {
                return {
                    ...module,
                    permissions: {
                        visible: permission.canView,
                        read: permission.canView,
                        write: permission.canCreate,
                        update: permission.canEdit,
                        delete: permission.canDelete,
                    },
                };
            }

            return module;
        });

        setModulePermissions(mergedPermissions);
    };

    /* =========================================================
       TOGGLE PERMISSION
    ========================================================= */

    const togglePermission = (moduleId: string, permission: PermissionAction) => {
        if (!selectedRole) return;

        setModulePermissions((prev) =>
            prev.map((module) => {
                if (module.moduleId !== moduleId) return module;

                const permissions = {
                    ...module.permissions,
                };

                /* ---------------- Visible ---------------- */

                if (permission === "visible") {
                    const enabled = !permissions.visible;

                    permissions.visible = enabled;

                    if (enabled) {
                        permissions.read = true;
                    } else {
                        permissions.read = false;
                        permissions.write = false;
                        permissions.update = false;
                        permissions.delete = false;
                    }

                    return {
                        ...module,
                        permissions,
                    };
                }

                if (!permissions.visible) return module;

                /* ---------------- Read ---------------- */

                if (permission === "read") {
                    if (permissions.write || permissions.update || permissions.delete) {
                        return module;
                    }

                    permissions.read = !permissions.read;

                    return { ...module, permissions };
                }

                /* ---------------- Write / Update / Delete ---------------- */

                permissions.read = true;

                permissions[permission] = !permissions[permission];

                return { ...module, permissions };
            })
        );
    };

    /* =========================================================
       FULL ACCESS
    ========================================================= */

    const toggleFullAccess = (moduleId: string) => {
        if (!selectedRole) return;

        setModulePermissions((prev) =>
            prev.map((module) => {
                if (module.moduleId !== moduleId) return module;

                const fullAccess = module.permissions.visible && module.permissions.read && module.permissions.write && module.permissions.update && module.permissions.delete;

                return { ...module, permissions: { visible: !fullAccess, read: !fullAccess, write: !fullAccess, update: !fullAccess, delete: !fullAccess }, };
            })
        );
    };

    /*  ========================================================
                    GRANT ALL
        ========================================================= */

    const grantAllModules = () => {
        if (!selectedRole) return;

        setModulePermissions((prev) =>
            prev.map((module) => ({
                ...module,
                permissions: {
                    visible: true,
                    read: true,
                    write: true,
                    update: true,
                    delete: true,
                },
            }))
        );
    };

    /*  ========================================================
                    REVOKE ALL
        ========================================================= */

    const revokeAllModules = () => {
        if (!selectedRole) return;

        setModulePermissions((prev) =>
            prev.map((module) => ({
                ...module,
                permissions: defaultPermission(),
            }))
        );
    };

    /*  ========================================================
                        SAVE
        ========================================================= */

    const handleSave = async () => {
        if (!selectedRole) {
            alert("Please select a role.");
            return;
        }

        try {
            const updatedRole = modulePermissions
                .filter((module) => module.permissions.visible === true)
                .map((module) => ({
                    moduleId: module.moduleId,
                    moduleName: module.moduleName,
                    permissions: module.permissions,
                }));

            await updateRolePermissions({
                roleId: selectedRole,
                permissions: updatedRole,
            });

            setModulePermissions([])
            setSelectedRole("")

            alert("Permissions saved successfully.");
        } catch (err) {
            console.log(err);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">

            {/* =========================================================
                                     HEADER
                ========================================================= */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Role Permission Manager
                    </h1>

                    <p className="mt-2 max-w-2xl text-slate-500">
                        Manage module visibility and CRUD permissions for each
                        role in your application.
                    </p>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                        onClick={grantAllModules}
                        disabled={!selectedRole}
                        className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Grant All
                    </button>

                    <button
                        onClick={revokeAllModules}
                        disabled={!selectedRole}
                        className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Revoke All
                    </button>

                </div>

            </div>

            {/* =========================================================
                            DASHBOARD CARDS
                ========================================================= */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {/* Select Role */}

                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">

                    <label className="mb-3 block text-sm font-semibold text-slate-200">
                        Select Role
                    </label>

                    <select
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    >
                        <option value="">
                            Select Role
                        </option>

                        {roles.map((role) => (

                            <option
                                key={role._id}
                                value={role._id}
                            >
                                {role.roleName}
                            </option>

                        ))}

                    </select>

                    <p className="mt-4 text-sm text-slate-400">
                        Selecting a role automatically loads its saved
                        permissions.
                    </p>

                </div>

                {/* Active Role */}

                <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl">

                    <p className="text-sm text-blue-100">
                        Active Role
                    </p>

                    <h2 className="mt-3 text-4xl font-bold">

                        {selectedRole
                            ? roles.find(
                                (role) =>
                                    role._id === selectedRole
                            )?.roleName
                            : "--"}

                    </h2>

                    <p className="mt-5 text-blue-100">
                        Current role whose permissions are being edited.
                    </p>

                </div>

                {/* Enabled Modules */}

                <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl md:col-span-2 xl:col-span-1">

                    <p className="text-sm text-green-100">
                        Enabled Modules
                    </p>

                    <h2 className="mt-4 text-5xl font-bold">

                        {
                            modulePermissions.filter(
                                (module) =>
                                    module.permissions.visible
                            ).length
                        }

                    </h2>

                    <p className="mt-3 text-green-100">
                        of {modulePermissions.length} Modules
                    </p>

                </div>

            </div>

            {/* =========================================================
                                 SUMMARY
                ========================================================= */}

            {selectedRole && (

                <div className="rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 p-6 shadow">

                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                        <div>

                            <h2 className="text-3xl font-bold text-slate-900">

                                {roles.find((role) => role._id === selectedRole)?.roleName}

                            </h2>

                            <p className="mt-2 text-slate-600">
                                Configure module permissions for this role.
                            </p>

                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">

                            {/* Modules */}

                            <div className="rounded-2xl bg-white p-5 text-center shadow">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Modules
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {modulePermissions.length}
                                </h3>

                            </div>

                            {/* Enabled */}

                            <div className="rounded-2xl bg-white p-5 text-center shadow">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Enabled
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-green-600">

                                    {modulePermissions.filter((module) => module.permissions.visible).length}

                                </h3>

                            </div>

                            {/* Disabled */}

                            <div className="rounded-2xl bg-white p-5 text-center shadow">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Disabled
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-red-600">

                                    {modulePermissions.filter((module) => !module.permissions.visible).length}

                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* =========================================================
                       MOBILE PERMISSION CARDS
                ========================================================= */}

            <div className="space-y-5 lg:hidden">

                {modulePermissions.map((module) => {

                    const {
                        visible,
                        read,
                        write,
                        update,
                        delete: remove,
                    } = module.permissions;

                    const fullAccess =
                        visible &&
                        read &&
                        write &&
                        update &&
                        remove;

                    return (

                        <div
                            key={module.moduleId}
                            className={`overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 ${visible
                                ? "border-blue-200 bg-white"
                                : "border-slate-200 bg-slate-50"
                                }`}
                        >

                            {/* Header */}

                            <div className="border-b border-slate-200 px-5 py-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-900">
                                            {module.moduleName}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Module Permissions
                                        </p>

                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${visible
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {visible ? "Enabled" : "Disabled"}
                                    </span>

                                </div>

                            </div>

                            {/* Body */}

                            <div className="space-y-4 p-5">

                                {/* Visible */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="font-medium text-slate-800">
                                            Visible
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Allow this module to appear.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={visible}
                                        color="green"
                                        disabled={!selectedRole}
                                        onChange={() =>
                                            togglePermission(
                                                module.moduleId,
                                                "visible"
                                            )
                                        }
                                    />

                                </div>

                                {/* Read */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="font-medium text-slate-800">
                                            Read
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            View records.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={read}
                                        disabled={
                                            !selectedRole ||
                                            !visible ||
                                            write ||
                                            update ||
                                            remove
                                        }
                                        onChange={() =>
                                            togglePermission(
                                                module.moduleId,
                                                "read"
                                            )
                                        }
                                    />

                                </div>

                                {/* Write */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="font-medium text-slate-800">
                                            Write
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Create new records.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={write}
                                        color="blue"
                                        disabled={
                                            !selectedRole ||
                                            !visible
                                        }
                                        onChange={() =>
                                            togglePermission(
                                                module.moduleId,
                                                "write"
                                            )
                                        }
                                    />

                                </div>

                                {/* Update */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="font-medium text-slate-800">
                                            Update
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Edit existing records.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={update}
                                        color="purple"
                                        disabled={
                                            !selectedRole ||
                                            !visible
                                        }
                                        onChange={() =>
                                            togglePermission(
                                                module.moduleId,
                                                "update"
                                            )
                                        }
                                    />

                                </div>

                                {/* Delete */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="font-medium text-slate-800">
                                            Delete
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Remove records.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={remove}
                                        color="red"
                                        disabled={
                                            !selectedRole ||
                                            !visible
                                        }
                                        onChange={() =>
                                            togglePermission(
                                                module.moduleId,
                                                "delete"
                                            )
                                        }
                                    />

                                </div>

                                {/* Divider */}

                                <div className="border-t border-slate-200" />

                                {/* Full Access */}

                                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-4">

                                    <div>

                                        <h4 className="font-semibold text-slate-900">
                                            Full Access
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            Enable every permission.
                                        </p>

                                    </div>

                                    <ToggleSwitch
                                        checked={fullAccess}
                                        color="purple"
                                        disabled={!selectedRole}
                                        onChange={() =>
                                            toggleFullAccess(
                                                module.moduleId
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* =========================================================
                        DESKTOP PERMISSION TABLE (lg+)
                ========================================================= */}

            <div className="hidden lg:block">

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">

                                <tr>

                                    <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider text-white">
                                        Module
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Visible
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Read
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Write
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Update
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Delete
                                    </th>

                                    <th className="px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                        Full Access
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {modulePermissions.map((module) => {

                                    const { visible, read, write, update, delete: remove, } = module.permissions;

                                    const fullAccess = visible && read && write && update && remove;

                                    return (

                                        <tr
                                            key={module.moduleId}
                                            className={`transition-all duration-300 border-b last:border-b-0 hover:bg-blue-50 ${visible
                                                ? "bg-white"
                                                : "bg-slate-50"
                                                }`}
                                        >

                                            {/* Module */}

                                            <td className="px-8 py-6">

                                                <div className="flex items-center justify-between">

                                                    <div>

                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {module.moduleName}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Module Permissions
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${visible
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                            }`}
                                                    >
                                                        {visible ? "Enabled" : "Disabled"}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Visible */}

                                            <td className="px-4 py-6">

                                                <div className="flex flex-col items-center gap-2">

                                                    <ToggleSwitch
                                                        checked={visible}
                                                        color="green"
                                                        disabled={!selectedRole}
                                                        onChange={() =>
                                                            togglePermission(
                                                                module.moduleId,
                                                                "visible"
                                                            )
                                                        }
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        Module
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Read */}

                                            <td className="px-4 py-6">

                                                <div className="flex flex-col items-center gap-2">

                                                    <ToggleSwitch
                                                        checked={read}
                                                        disabled={
                                                            !selectedRole ||
                                                            !visible ||
                                                            write ||
                                                            update ||
                                                            remove
                                                        }
                                                        onChange={() =>
                                                            togglePermission(
                                                                module.moduleId,
                                                                "read"
                                                            )
                                                        }
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        View
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Write */}

                                            <td className="px-4 py-6">

                                                <div className="flex flex-col items-center gap-2">

                                                    <ToggleSwitch
                                                        checked={write}
                                                        color="blue"
                                                        disabled={
                                                            !selectedRole ||
                                                            !visible
                                                        }
                                                        onChange={() =>
                                                            togglePermission(
                                                                module.moduleId,
                                                                "write"
                                                            )
                                                        }
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        Create
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Update */}

                                            <td className="px-4 py-6">

                                                <div className="flex flex-col items-center gap-2">

                                                    <ToggleSwitch
                                                        checked={update}
                                                        color="purple"
                                                        disabled={
                                                            !selectedRole ||
                                                            !visible
                                                        }
                                                        onChange={() =>
                                                            togglePermission(
                                                                module.moduleId,
                                                                "update"
                                                            )
                                                        }
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        Edit
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Delete */}

                                            <td className="px-4 py-6">

                                                <div className="flex flex-col items-center gap-2">

                                                    <ToggleSwitch
                                                        checked={remove}
                                                        color="red"
                                                        disabled={
                                                            !selectedRole ||
                                                            !visible
                                                        }
                                                        onChange={() =>
                                                            togglePermission(
                                                                module.moduleId,
                                                                "delete"
                                                            )
                                                        }
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        Remove
                                                    </span>

                                                </div>

                                            </td>

                                            {/* Full Access */}

                                            <td className="px-4 py-6">

                                                <div className="mx-auto flex w-36 flex-col items-center rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-3">

                                                    <ToggleSwitch
                                                        checked={fullAccess}
                                                        color="purple"
                                                        disabled={!selectedRole}
                                                        onChange={() =>
                                                            toggleFullAccess(
                                                                module.moduleId
                                                            )
                                                        }
                                                    />

                                                    <span className="mt-2 text-xs font-medium text-slate-600">
                                                        All Access
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* =========================================================
                           SAVE PERMISSIONS SECTION
                ========================================================= */}

            <div className="sticky bottom-0 z-50 mt-8">

                <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-slate-900">
                                Save Permission Changes
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Review the permissions before saving. These changes will be
                                applied to the selected role.
                            </p>

                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!selectedRole}
                            className="
                    w-full
                    lg:w-auto
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    via-indigo-600
                    to-purple-600
                    px-10
                    py-4
                    text-lg
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:shadow-2xl
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                        >
                            💾 Save Permissions
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

