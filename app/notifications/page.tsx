"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Info,
  Sparkles,
} from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../src/api";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  event_id: number | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      setNotifications(
        Array.isArray(data)
          ? data
          : Array.isArray(data.notifications)
          ? data.notifications
          : []
      );
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: number) {
    try {
      await markNotificationAsRead(id);

      setNotifications((oldNotifications) =>
        oldNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((oldNotifications) =>
        oldNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "new_event":
        return <CalendarDays size={19} />;

      case "deadline":
        return <Bell size={19} />;

      case "recommendation":
        return <Sparkles size={19} />;

      default:
        return <Info size={19} />;
    }
  }

  return (
    <main className="min-h-screen bg-surface p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EEEAFE] text-brand">
              <Bell size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand">
                Updates
              </p>

              <h1 className="text-3xl font-bold">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-muted">
                Stay updated with events and activities.
              </p>
            </div>
          </div>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-brand shadow-sm ring-1 ring-black/5 transition hover:bg-[#F5F2FF] disabled:opacity-50"
            >
              <CheckCheck size={16} />

              {markingAll
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Unread count */}
        {!loading && !error && notifications.length > 0 && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold">
                Your notifications
              </p>

              <p className="mt-1 text-xs text-muted">
                {unreadCount === 0
                  ? "You're all caught up."
                  : `${unreadCount} unread notification${
                      unreadCount === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAFE] text-sm font-bold text-brand">
              {unreadCount}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />

            <p className="text-sm text-muted">
              Loading notifications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Failed to load notifications
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={loadNotifications}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EEEAFE] text-brand">
                <Bell size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                You don't have any notifications yet.
                New event updates will appear here.
              </p>
            </div>
          )}

        {/* Notifications */}
        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`relative rounded-2xl border bg-white p-5 shadow-sm transition ${
                    notification.is_read
                      ? "border-black/5"
                      : "border-brand/20 bg-[#FCFBFF]"
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-brand" />
                  )}

                  <div className="flex gap-4">

                    {/* Icon */}
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                        notification.is_read
                          ? "bg-slate-100 text-slate-500"
                          : "bg-[#EEEAFE] text-brand"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-bold">
                          {notification.title}
                        </h2>

                        {!notification.is_read && (
                          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-3 text-[11px] text-muted">
                        {formatDate(notification.created_at)}
                      </p>

                      {/* Mark as read */}
                      {!notification.is_read && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                          className="mt-4 flex items-center gap-2 rounded-lg bg-[#F3F0FF] px-3 py-2 text-[11px] font-semibold text-brand transition hover:bg-[#EAE5FF]"
                        >
                          <Check size={14} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}