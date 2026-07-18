/**
 * UserMenu — profile dropdown for the logged-in user.
 *
 * Built on Radix DropdownMenu. Shows the user's Avatar as a trigger.
 * Dropdown items: Profile, Settings, separator, Theme (Light/Dark/System),
 * separator, Sign out.
 *
 * The ThemePreference is consumed from @cognix/ui's useTheme hook,
 * so it works automatically when the app wraps in <ThemeProvider>.
 */
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, cn, useThemeContext } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface UserMenuProps {
  /** Called when "Profile" is clicked. */
  onProfile?: () => void;
  /** Called when "Settings" is clicked. */
  onSettings?: () => void;
  /** Called when "Sign out" is clicked. */
  onSignOut?: () => void;
  className?: string;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const itemClass = cn(
  "flex items-center gap-2.5 px-2.5 py-2",
  "rounded-[var(--radius-lg)]",
  "text-[var(--text-sm)] text-[var(--color-text-primary)]",
  "cursor-pointer select-none outline-none",
  "hover:bg-[var(--color-surface-hover)]",
  "focus:bg-[var(--color-surface-hover)]",
  "transition-colors duration-[var(--duration-fast)]",
);

/* ─── Component ──────────────────────────────────────────────────────────── */

export function UserMenu({ onProfile, onSettings, onSignOut, className }: UserMenuProps) {
  const { user } = useAppShell();
  const { theme, setTheme, themes } = useThemeContext();

  const themeIcons = {
    light: <SunIcon size={14} aria-hidden />,
    dark: <MoonIcon size={14} aria-hidden />,
    system: <MonitorIcon size={14} aria-hidden />,
  } as const;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="User menu"
          className={cn(
            "rounded-[var(--radius-full)] focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
            className,
          )}
        >
          <Avatar
            {...(user.avatarUrl ? { src: user.avatarUrl } : {})}
            name={user.name}
            size="sm"
            shape="circle"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-[var(--z-dropdown)] w-[220px]",
            "rounded-[var(--radius-xl)]",
            "border border-[var(--color-border)]",
            "bg-[var(--color-surface-raised)]",
            "shadow-[var(--shadow-lg)]",
            "p-1.5",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "origin-[--radix-dropdown-menu-content-transform-origin]",
          )}
        >
          {/* User info header */}
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-1">
            <Avatar
              {...(user.avatarUrl ? { src: user.avatarUrl } : {})}
              name={user.name}
              size="sm"
              shape="circle"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)] truncate">
                {user.name}
              </span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate">
                {user.email}
              </span>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

          {/* Profile */}
          <DropdownMenu.Item {...(onProfile ? { onSelect: onProfile } : {})} className={itemClass}>
            <UserIcon size={14} aria-hidden />
            <span>Profile</span>
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            {...(onSettings ? { onSelect: onSettings } : {})}
            className={itemClass}
          >
            <SettingsIcon size={14} aria-hidden />
            <span>Settings</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

          {/* Theme sub-menu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={cn(itemClass, "data-[state=open]:bg-[var(--color-surface-hover)]")}
            >
              {themeIcons[theme === "system" ? "system" : theme]}
              <span className="flex-1">Theme</span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] capitalize">
                {theme}
              </span>
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                sideOffset={6}
                className={cn(
                  "z-[var(--z-dropdown)] w-[160px]",
                  "rounded-[var(--radius-xl)]",
                  "border border-[var(--color-border)]",
                  "bg-[var(--color-surface-raised)]",
                  "shadow-[var(--shadow-lg)]",
                  "p-1.5",
                  "animate-in fade-in-0 zoom-in-95",
                  "origin-[--radix-dropdown-menu-content-transform-origin]",
                )}
              >
                {themes.map((t) => (
                  <DropdownMenu.Item key={t} onSelect={() => setTheme(t)} className={itemClass}>
                    {themeIcons[t]}
                    <span className="flex-1 capitalize">{t}</span>
                    {theme === t && (
                      <CheckIcon size={14} className="text-[var(--color-accent)]" aria-hidden />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

          {/* Sign out */}
          <DropdownMenu.Item
            {...(onSignOut ? { onSelect: onSignOut } : {})}
            className={cn(
              itemClass,
              "text-[var(--color-error)] hover:bg-[var(--color-error-light)]/10 focus:bg-[var(--color-error-light)]/10",
            )}
          >
            <LogOutIcon size={14} aria-hidden />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

UserMenu.displayName = "UserMenu";
