// Blocks Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    loadBlocks();
});

// Load all blocks
async function loadBlocks() {
    const tbody = document.getElementById('blockTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border" role="status"></div></td></tr>';
    
    try {
        const response = await makeAuthenticatedRequest(`/blocks`);
        if (response.ok) {
            const blocks = await response.json();
            displayBlocks(blocks);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading blocks:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
                    <p class="mt-2">Failed to load blocks. Please check your connection.</p>
                    <button class="btn btn-sm btn-primary" onclick="loadBlocks()">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Display blocks in table
function displayBlocks(blocks) {
    const tbody = document.getElementById('blockTableBody');
    tbody.innerHTML = '';
    
    if (blocks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No block records found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    blocks.forEach(block => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${block.id}</td>
            <td>${block.name}</td>
            <td>${block.created_at ? new Date(block.created_at).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewBlock(${block.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBlock(${block.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add block modal
function addBlock() {
    document.getElementById('blockForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('blockModal'));
    modal.show();
}

// Save block
async function saveBlock() {
    const blockName = document.getElementById('blockName').value;
    
    if (!blockName) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`/add_block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: blockName
            })
        });
        
        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('blockModal'));
            closeModalProperly(modal);
            loadBlocks();
            showAlert('Block added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error adding block', 'danger');
        }
    } catch (error) {
        console.error('Error saving block:', error);
        showAlert('Error adding block', 'danger');
    }
}

// View block details
function viewBlock(blockId) {
    showAlert(`Block ID: ${blockId}`, 'info');
}

// Delete block (placeholder function)
function deleteBlock(blockId) {
    if (confirm('Are you sure you want to delete this block?')) {
        showAlert('Delete functionality not implemented yet', 'info');
    }
}

// Search blocks
function searchBlocks() {
    const searchTerm = document.getElementById('blockSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#blockTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
