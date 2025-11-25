/**
 * Example: Using Relation Fields in EntityForm
 * 
 * This example demonstrates how to use the new relation and multirelation
 * field types to select related entities in forms.
 */

import { EntityForm } from '../components/form';
import { FormField } from '../components/form/types';

// Example 1: Single Relation Field
// Select one user from a list of users

interface Task {
    id: string;
    title: string;
    description: string;
    assignedUserId: string; // Single user ID
    tagIds: string[]; // Multiple tag IDs
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface Tag {
    id: string;
    name: string;
    color: string;
}

// Mock API functions
const fetchUsers = async (search?: string): Promise<User[]> => {
    // In real app, this would call your API
    const users = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    if (search) {
        return users.filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
    }

    return users;
};

const fetchTags = async (search?: string): Promise<Tag[]> => {
    const tags = [
        { id: '1', name: 'Bug', color: 'red' },
        { id: '2', name: 'Feature', color: 'blue' },
        { id: '3', name: 'Documentation', color: 'green' },
        { id: '4', name: 'Enhancement', color: 'purple' },
    ];

    if (search) {
        return tags.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    return tags;
};

// Define form fields with relation types
const taskFields: FormField<Task>[] = [
    {
        name: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'Enter task title',
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 4,
        placeholder: 'Describe the task',
    },
    {
        name: 'assignedUserId',
        label: 'Assigned To',
        type: 'relation',
        placeholder: 'Select a user',
        required: true,
        relationConfig: {
            entity: 'users',
            displayField: 'name',
            valueField: 'id',
            searchFields: ['name', 'email'],
            fetchOptions: fetchUsers,
        },
    },
    {
        name: 'tagIds',
        label: 'Tags',
        type: 'multirelation',
        placeholder: 'Add tags',
        relationConfig: {
            entity: 'tags',
            displayField: 'name',
            valueField: 'id',
            searchFields: ['name'],
            fetchOptions: fetchTags,
            multiple: true,
            maxSelections: 3, // Limit to 3 tags
        },
    },
];

// Example usage in a component
export function TaskFormExample() {
    const handleSubmit = async (values: Partial<Task>) => {
        console.log('Submitted values:', values);
        // values.assignedUserId will be the user ID (string)
        // values.tagIds will be an array of tag IDs (string[])

        // Send to API
        // await createTask(values);
    };

    return (
        <EntityForm
            fields={taskFields}
            mode="create"
            onSubmit={handleSubmit}
            submitText="Create Task"
        />
    );
}

// Example 2: Edit Mode with Existing Relations
export function TaskEditExample() {
    const existingTask: Task = {
        id: '123',
        title: 'Fix login bug',
        description: 'Users cannot log in with email',
        assignedUserId: '1', // John Doe
        tagIds: ['1', '2'], // Bug, Feature
    };

    const handleSubmit = async (values: Partial<Task>) => {
        console.log('Updated values:', values);
        // await updateTask(existingTask.id, values);
    };

    return (
        <EntityForm
            fields={taskFields}
            mode="edit"
            entity={existingTask}
            onSubmit={handleSubmit}
            submitText="Update Task"
        />
    );
}

// Example 3: View Mode
export function TaskViewExample() {
    const task: Task = {
        id: '123',
        title: 'Fix login bug',
        description: 'Users cannot log in with email',
        assignedUserId: '1',
        tagIds: ['1', '2'],
    };

    return (
        <EntityForm
            fields={taskFields}
            mode="view"
            entity={task}
            onSubmit={() => { }} // Not used in view mode
        />
    );
}

// Example 4: Advanced - With onCreate for creating new entities
const advancedFields: FormField<Task>[] = [
    // ... other fields
    {
        name: 'assignedUserId',
        label: 'Assigned To',
        type: 'relation',
        relationConfig: {
            entity: 'users',
            displayField: 'name',
            valueField: 'id',
            fetchOptions: fetchUsers,
            // Allow creating new users on the fly
            onCreate: async (name: string) => {
                const newUser = await createUser({ name, email: `${name}@example.com` });
                return newUser;
            },
        },
    },
];

async function createUser(data: { name: string; email: string }): Promise<User> {
    // API call to create user
    return { id: Date.now().toString(), ...data };
}
