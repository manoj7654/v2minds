const fileCheckboxes = document.querySelectorAll('.file-checkbox');
const selectAllBox = document.getElementById('select-all');
const cloneContainer = document.getElementById('cloned-items');
const removeBtn = document.getElementById('remove-button');
const filesList = document.getElementById('file-list');
const backBtn = document.getElementById('back-button');
const pathDisplay = document.getElementById('current-path');

const directoryStructure = {
    '/': [
        { name: 'Music', type: 'folder', path: '/Music' },
        { name: 'Photos', type: 'folder', path: '/Photos' },
        { name: 'Documents', type: 'folder', path: '/Documents' },
        { name: 'Shared', type: 'folder', path: '/Shared' }
    ],
    '/Music': [
        { name: 'song1.mp3', type: 'file', path: '/Music/song1.mp3' },
        { name: 'song2.mp3', type: 'file', path: '/Music/song2.mp3' }
    ],
    '/Photos': [
        { name: 'vacation.jpg', type: 'file', path: '/Photos/vacation.jpg' },
        { name: 'birthday.jpg', type: 'file', path: '/Photos/birthday.jpg' }
    ],
    '/Documents': [
        { name: 'resume.pdf', type: 'file', path: '/Documents/resume.pdf' },
        { name: 'content', type: 'folder', path: '/Documents/content' },
        { name: 'cover_letter.docx', type: 'file', path: '/Documents/cover_letter.docx' }
    ],
    '/Shared': [
        { name: 'report.xlsx', type: 'file', path: '/Shared/report.xlsx' },
        { name: 'presentation.pptx', type: 'file', path: '/Shared/presentation.pptx' }
    ]
};

let currentDirectory = '/';

// Function to display files and folders in a directory
function displayFolder(folder) {
    filesList.innerHTML = '';
    directoryStructure[folder].forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="file-checkbox" data-name="${item.name}"> ${item.type === 'folder' ? `<span class="folder" data-path="${item.path}">${item.name}</span>` : item.name}</td>
            <td>---</td>
            <td>2024/01/01 10:00:00 AM</td>
        `;
        filesList.appendChild(row);
    });

    // Attach event listeners to checkboxes and folders
    const checkboxes = document.querySelectorAll('.file-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', refreshState);
    });

    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            moveToFolder(folder.dataset.path);
        });
    });

    updatePathDisplay(folder);
}

// Function to navigate to a folder
function moveToFolder(path) {
    currentDirectory = path;
    displayFolder(path);
    updatePathDisplay(path);
}

// Function to update the path display
function updatePathDisplay(path) {
    const pathArray = path.split('/').filter(p => p);
    pathDisplay.innerHTML = '';
    pathArray.forEach((segment, index) => {
        const fullPath = '/' + pathArray.slice(0, index + 1).join('/');
        const button = document.createElement('button');
        button.classList.add('path-segment');
        button.dataset.path = fullPath;
        button.innerText = segment;
        button.addEventListener('click', function() {
            moveToFolder(fullPath);
        });
        pathDisplay.appendChild(button);
    });
    backBtn.classList.toggle('hidden', pathArray.length === 0);
}

// Event listener for back button
backBtn.addEventListener('click', function() {
    const pathArray = currentDirectory.split('/').filter(p => p);
    pathArray.pop();
    moveToFolder('/' + pathArray.join('/'));
});

// Event listener for select all checkbox
selectAllBox.addEventListener('change', function() {
    const isChecked = selectAllBox.checked;
    const currentCheckboxes = document.querySelectorAll('.file-checkbox');
    currentCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    refreshState();
});

// Function to refresh the state of checkboxes
function refreshState() {
    const currentCheckboxes = document.querySelectorAll('.file-checkbox');
    const allChecked = [...currentCheckboxes].every(checkbox => checkbox.checked);
    const someChecked = [...currentCheckboxes].some(checkbox => checkbox.checked);

    if (allChecked) {
        selectAllBox.checked = true;
        selectAllBox.indeterminate = false;
    } else if (someChecked) {
        selectAllBox.checked = false;
        selectAllBox.indeterminate = true;
    } else {
        selectAllBox.checked = false;
        selectAllBox.indeterminate = false;
    }

    refreshClonedItems();
}

// Function to refresh cloned items in the backup box
function refreshClonedItems() {
    cloneContainer.innerHTML = '';
    const checkedItems = [...document.querySelectorAll('.file-checkbox')].filter(checkbox => checkbox.checked);

    checkedItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `<input type="checkbox" data-name="${item.dataset.name}" class="cloned-checkbox"> ${item.dataset.name}`;
        cloneContainer.appendChild(div);
    });

    removeBtn.classList.toggle('hidden', checkedItems.length === 0);

    const clonedCheckboxes = document.querySelectorAll('.cloned-checkbox');
    clonedCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const originalCheckbox = document.querySelector(`.file-checkbox[data-name="${checkbox.dataset.name}"]`);
            if (originalCheckbox) {
                originalCheckbox.checked = checkbox.checked;
                refreshState();
            }
        });
    });
}

// Event listener for remove button
removeBtn.addEventListener('click', function() {
    const clonedCheckboxes = document.querySelectorAll('.cloned-checkbox');
    clonedCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const originalCheckbox = document.querySelector(`.file-checkbox[data-name="${checkbox.dataset.name}"]`);
            if (originalCheckbox) {
                originalCheckbox.checked = false;
            }
            checkbox.closest('.item').remove();
        }
    });
    refreshState();
});

// Initial display of the root folder
displayFolder('/');
