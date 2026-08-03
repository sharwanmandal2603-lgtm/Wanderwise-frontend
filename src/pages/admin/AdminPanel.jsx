import React from 'react'
import useApi from '@/hooks/useApi'
import api from '@/api/axios'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { formatDate } from '@/lib/formatter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Plane, ShieldCheck, ShieldOff, Trash2, Users, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "trips", label: "Trips" },
]

const AdminPanel = () => {

  const { token } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");
  const [dependency, setDependency] = React.useState(0);

  const { data: stats, error: statsError, loading: statsLoading } = useApi("/admin/stats", {}, [dependency]);
  const { data: users, error: usersError, loading: usersLoading } = useApi("/admin/users", {}, [dependency]);
  const { data: trips, error: tripsError, loading: tripsLoading } = useApi("/admin/trips", {}, [dependency]);

  let currentUserId = null;
  try {
    currentUserId = token ? jwtDecode(token)?.userId : null;
  } catch {
    currentUserId = null;
  }

  const refresh = () => setDependency((prev) => prev + 1);

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await api.patch(`/admin/users/${id}`, { role: newRole });

      if (response.status === 200) {
        toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}`);
        refresh();
      } else {
        toast.error(response.message || "Error updating user");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Some error occured");
    }
  }

  const handleUserDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);

      if (response.status === 200) {
        toast.success("User deleted successfully");
        refresh();
      } else {
        toast.error(response.message || "Error deleting user");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Some error occured");
    }
  }

  const handleTripDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/trips/${id}`);

      if (response.status === 200) {
        toast.success("Trip deleted successfully");
        refresh();
      } else {
        toast.error(response.message || "Error deleting trip");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Some error occured");
    }
  }

  return (
    <div className="mt-20 p-6 md:p-8 lg:p-20 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Platform-wide overview and management.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {
          TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))
        }
      </div>

      {
        activeTab === "overview" && (
          statsLoading
            ? <Loader2 className="animate-spin mt-20 mx-auto" />
            : statsError
              ? <div className="mt-10 text-center">Error: {statsError.message}</div>
              : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <ShieldCheck className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Admins</p>
                        <p className="text-2xl font-bold">{stats?.totalAdmins ?? 0}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <Plane className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trips</p>
                        <p className="text-2xl font-bold">{stats?.totalTrips ?? 0}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Wallet className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent / Budget</p>
                        <p className="text-2xl font-bold">
                          ${stats?.totalSpent ?? 0} <span className="text-base font-normal text-muted-foreground">/ ${stats?.totalBudget ?? 0}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
        )
      }

      {
        activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Users</CardTitle>
              <CardDescription>Manage every account on the platform.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {
                usersLoading
                  ? <Loader2 className="animate-spin mx-auto" />
                  : usersError
                    ? <div className="text-center">Error: {usersError.message}</div>
                    : users.length === 0
                      ? <div>No users to show.</div>
                      : users.map((item) => {
                        return (
                          <div
                            key={item._id}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-200 rounded-lg p-4"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.name}</p>
                                <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>
                                  {item.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.email}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {
                                item._id === currentUserId
                                  ? <Badge variant="outline">This is you</Badge>
                                  : (
                                    <>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            Change Role
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem
                                            disabled={item.role === 'admin'}
                                            onClick={() => handleRoleChange(item._id, 'admin')}
                                          >
                                            <ShieldCheck className="mr-2 h-4 w-4" /> Make Admin
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            disabled={item.role === 'user'}
                                            onClick={() => handleRoleChange(item._id, 'user')}
                                          >
                                            <ShieldOff className="mr-2 h-4 w-4" /> Make User
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                      <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleUserDelete(item._id)}
                                      >
                                        <Trash2 />
                                      </Button>
                                    </>
                                  )
                              }
                            </div>
                          </div>
                        )
                      })
              }
            </CardContent>
          </Card>
        )
      }

      {
        activeTab === "trips" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">All Trips</CardTitle>
              <CardDescription>Every trip created on the platform, across all users.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {
                tripsLoading
                  ? <Loader2 className="animate-spin mx-auto" />
                  : tripsError
                    ? <div className="text-center">Error: {tripsError.message}</div>
                    : trips.length === 0
                      ? <div>No trips to show.</div>
                      : trips.map((trip) => {
                        return (
                          <div
                            key={trip._id}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-200 rounded-lg p-4"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{trip.title}</p>
                                <Badge variant="secondary">{trip.destinations?.join(", ")}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Owner: {trip.user?.name} ({trip.user?.email})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Budget: ${trip.budget?.spent ?? 0} / ${trip.budget?.total ?? 0}
                              </p>
                            </div>

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleTripDelete(trip._id)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        )
                      })
              }
            </CardContent>
          </Card>
        )
      }

    </div>
  )
}

export default AdminPanel
