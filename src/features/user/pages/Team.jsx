import { useState } from "react";
import {
  IconChecklist,
  IconSearch,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasAnyPermission } from "@/lib/utils";
import Role from "./Role";
import { selectAuthPermissions } from "../../auth";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "@/constant/global";
import User from "./User";
import StateCard from "../components/StateCard";

// ─── Main Component ───────────────────────────────────────────────────────────

const Team = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const permissions = useSelector(selectAuthPermissions);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchQuery("");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="flex w-full min-w-0 animate-in flex-col gap-6 duration-500 fade-in">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Card className="relative overflow-hidden border-border/50 bg-card/60 p-0 shadow-sm backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -right-10 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <IconChecklist className="size-5 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Team Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your workspace members, roles, and platform access.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      {hasAnyPermission(permissions, [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_TEAM_STATS,
      ]) && <StateCard />}

      {/* ── Directory Section ─────────────────────────────────────────────── */}
      <section>
        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full min-w-0"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <TabsList className="border border-border/40 bg-background/60 shadow-sm">
              {hasAnyPermission(permissions, [
                PERMISSIONS.MANAGE_USERS,
                PERMISSIONS.VIEW_LIST_USERS,
              ]) && (
                <TabsTrigger value="users" className="gap-2">
                  <IconUsers className="size-4" />
                  Users
                </TabsTrigger>
              )}
              {hasAnyPermission(permissions, [
                PERMISSIONS.MANAGE_ROLES,
                PERMISSIONS.VIEW_LIST_ROLES,
              ]) && (
                <TabsTrigger value="roles" className="gap-2">
                  <IconShieldCheck className="size-4" />
                  Roles
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  placeholder={
                    activeTab === "users"
                      ? "Search users..."
                      : "Search roles..."
                  }
                  className="w-full border-border/50 bg-background/60 pl-9 text-sm shadow-sm sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Content Areas */}
          {hasAnyPermission(permissions, [
            PERMISSIONS.MANAGE_USERS,
            PERMISSIONS.VIEW_LIST_USERS,
          ]) && (
            <TabsContent value="users" className="mt-0 outline-none">
              <User searchQuery={searchQuery} permissions={permissions} />
            </TabsContent>
          )}

          {hasAnyPermission(permissions, [
            PERMISSIONS.MANAGE_ROLES,
            PERMISSIONS.VIEW_LIST_ROLES,
          ]) && (
            <TabsContent value="roles" className="mt-0 outline-none">
              <Role searchQuery={searchQuery} permissions={permissions} />
            </TabsContent>
          )}
        </Tabs>
      </section>
    </main>
  );
};

export default Team;
