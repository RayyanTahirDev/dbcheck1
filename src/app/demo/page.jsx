"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  User,
  FolderTree,
  Users,
  RotateCcw,
} from "lucide-react";

const organizationData = {
  id: "1",
  name: "John Doe",
  position: "CEO",
  department: "Executive",
  email: "john.doe@company.com",
  imageUrl:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  expanded: true,
  children: [
    {
      id: "2",
      name: "Sarah Johnson",
      position: "HR Director",
      department: "Human Resources",
      email: "sarah.johnson@company.com",
      imageUrl:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      expanded: false,
      children: [
        {
          id: "6",
          name: "Mike Wilson",
          position: "HR Manager",
          department: "Human Resources",
          email: "mike.wilson@company.com",
          imageUrl:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          expanded: false,
          children: [
            {
              id: "9",
              name: "Emma Davis",
              position: "HR Specialist",
              department: "Human Resources",
              email: "emma.davis@company.com",
              imageUrl:
                "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Robert Smith",
      position: "Head of Engineering",
      department: "Engineering",
      email: "robert.smith@company.com",
      imageUrl:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      expanded: false,
      children: [
        {
          id: "7",
          name: "Jennifer Lee",
          position: "Team Lead - Frontend",
          department: "Engineering",
          email: "jennifer.lee@company.com",
          imageUrl:
            "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          expanded: false,
          children: [
            {
              id: "10",
              name: "Alex Turner",
              position: "Frontend Developer",
              department: "Engineering",
              email: "alex.turner@company.com",
              imageUrl:
                "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Emily Brown",
      position: "Head of Marketing",
      department: "Marketing",
      email: "emily.brown@company.com",
      imageUrl:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      expanded: false,
      children: [
        {
          id: "8",
          name: "David Garcia",
          position: "Team Lead - Content",
          department: "Marketing",
          email: "david.garcia@company.com",
          imageUrl:
            "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          expanded: false,
          children: [
            {
              id: "11",
              name: "Sophia Martinez",
              position: "Content Creator",
              department: "Marketing",
              email: "sophia.martinez@company.com",
              imageUrl:
                "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Michael Johnson",
      position: "Head of Finance",
      department: "Finance",
      email: "michael.johnson@company.com",
      imageUrl:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      expanded: false,
      children: [],
    },
  ],
};

function EmployeeCard({ employee, onToggleExpand, onAddSubordinate, level }) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = employee.children && employee.children.length > 0;
  const widthClass = level === 0 ? "w-64 sm:w-72" : "w-56 sm:w-64";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className={`${widthClass} transition-all duration-300 ease-in-out transform ${
        isHovered ? "scale-[1.02] shadow-md" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="py-4 pb-2">
        <Button
          variant="ghost"
          className="p-0 h-auto w-full flex justify-between items-center mb-2 text-left"
          onClick={() => (window.location.href = `/employee/${employee.id}`)}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={employee.imageUrl} />
              <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm sm:text-base font-medium">
              {employee.name}
            </CardTitle>
          </div>
          <User size={16} className="text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium">{employee.position}</p>
          <p className="text-xs text-muted-foreground">{employee.department}</p>
          <p className="text-xs truncate">{employee.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 pb-3">
        {hasChildren ? (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 sm:h-8"
            onClick={() => onToggleExpand(employee.id)}
          >
            {employee.expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 sm:h-8 opacity-0"
            disabled
          >
            No Reports
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="text-xs h-7 sm:h-8"
          onClick={() => onAddSubordinate(employee.id)}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline ml-1">Add</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AddEmployeeModal({ isOpen, onClose, onAddEmployee, parentId }) {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    imageUrl: "",
    children: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parentId) {
      onAddEmployee(parentId, newEmployee);
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        email: "",
        imageUrl: "",
        children: [],
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {["name", "position", "department", "email", "imageUrl"].map(
              (field, index) => (
                <div
                  className="grid grid-cols-4 items-center gap-4"
                  key={index}
                >
                  <Label htmlFor={field} className="text-right capitalize">
                    {field}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    value={newEmployee[field]}
                    onChange={handleChange}
                    className="col-span-3"
                    required={field !== "imageUrl"}
                  />
                </div>
              )
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SingleOrgChart() {
  const [orgData, setOrgData] = useState(organizationData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedChart = localStorage.getItem("organizationChart");
    if (savedChart) {
      setOrgData(JSON.parse(savedChart));
    }
  }, []);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  const handleToggleExpand = (employeeId) => {
    const updateEmployeeExpanded = (employee) => {
      if (employee.id === employeeId) {
        return { ...employee, expanded: !employee.expanded };
      }
      if (employee.children) {
        return {
          ...employee,
          children: employee.children.map(updateEmployeeExpanded),
        };
      }
      return employee;
    };
    setOrgData(updateEmployeeExpanded(orgData));
  };

  const toggleCollapseAll = () => {
    const updateAllExpanded = (employee, expanded) => {
      return {
        ...employee,
        expanded,
        children: employee.children
          ? employee.children.map((child) => updateAllExpanded(child, expanded))
          : [],
      };
    };
    setIsCollapsed(!isCollapsed);
    setOrgData(updateAllExpanded(orgData, !isCollapsed));
  };

  const handleAddSubordinate = (employeeId) => {
    setSelectedParentId(employeeId);
    setModalOpen(true);
  };

  const handleAddEmployee = (parentId, newEmployee) => {
    const newEmployeeWithId = {
      ...newEmployee,
      id: generateId(),
    };
    const updateEmployeeChildren = (employee) => {
      if (employee.id === parentId) {
        const updatedChildren = employee.children
          ? [...employee.children, newEmployeeWithId]
          : [newEmployeeWithId];
        return {
          ...employee,
          children: updatedChildren,
          expanded: true,
        };
      }
      if (employee.children) {
        return {
          ...employee,
          children: employee.children.map(updateEmployeeChildren),
        };
      }
      return employee;
    };
    const updatedData = updateEmployeeChildren(orgData);
    setOrgData(updatedData);
    localStorage.setItem("organizationChart", JSON.stringify(updatedData));
  };

  const resetToDemo = () => {
    localStorage.removeItem("organizationChart");
    setOrgData(organizationData);
    setIsCollapsed(false);
  };

  const renderOrganizationalChart = (employee, level = 0) => {
    return (
      <div
        key={employee.id}
        className={`flex flex-col items-center ${
          level > 0 ? "mt-8 relative" : ""
        }`}
      >
        <EmployeeCard
          employee={employee}
          onToggleExpand={handleToggleExpand}
          onAddSubordinate={handleAddSubordinate}
          level={level}
        />
        {employee.children &&
          employee.children.length > 0 &&
          employee.expanded && (
            <div className="relative flex flex-col items-center">
              <div className="w-0.5 h-8 bg-border/70" />
              <div
                className={`flex flex-wrap justify-center gap-4 md:gap-8 relative px-2 md:px-0`}
              >
                {employee.children.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    <div className="w-0.5 h-5 bg-border/70" />
                    {renderOrganizationalChart(child, level + 1)}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Organizational Chart</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={toggleCollapseAll}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            {isCollapsed ? (
              <>
                <FolderTree className="h-4 w-4" />
                <span className="hidden sm:inline">Expand All</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Collapse All</span>
              </>
            )}
          </Button>
          <Button
            onClick={resetToDemo}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset to Demo</span>
          </Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto py-8 px-2 md:px-4">
        <div className="min-w-max flex justify-center">
          {renderOrganizationalChart(orgData)}
        </div>
      </div>
      <AddEmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        parentId={selectedParentId}
      />
    </div>
  );
}
