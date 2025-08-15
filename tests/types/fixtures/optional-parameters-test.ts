/**
 * TypeScript test for optional parameters based on official documentation
 * This file tests the corrections made to jsDoc annotations for optional parameters
 */

import jsMind, { JsMindOptions, NodeTreeFormat } from './types/generated/index';

// ============================================================================
// Test 1: Optional parameters in styling methods
// ============================================================================

function testOptionalStylingParameters() {
    const options: JsMindOptions = {
        container: 'test_container'
    };
    
    const jm = new jsMind(options);
    const testData: NodeTreeFormat = {
        meta: { name: 'test', author: 'test', version: '1.0' },
        format: 'node_tree',
        data: { id: 'root', topic: 'Test Root' }
    };
    
    jm.show(testData);
    const root = jm.get_root();
    
    if (root) {
        const node = jm.add_node(root, 'test_node', 'Test Node');
        
        if (node) {
            // Test set_node_color with optional parameters
            jm.set_node_color(node.id); // All parameters optional
            jm.set_node_color(node.id, '#ff0000'); // Only bg_color
            jm.set_node_color(node.id, '#ff0000', '#ffffff'); // Both colors
            jm.set_node_color(node.id, undefined, '#ffffff'); // Only fg_color
            
            // Test set_node_font_style with optional parameters
            jm.set_node_font_style(node.id); // All parameters optional
            jm.set_node_font_style(node.id, 16); // Only size
            jm.set_node_font_style(node.id, 16, 'bold'); // Size and weight
            jm.set_node_font_style(node.id, 16, 'bold', 'italic'); // All parameters
            jm.set_node_font_style(node.id, undefined, 'bold'); // Only weight
            jm.set_node_font_style(node.id, undefined, undefined, 'italic'); // Only style
            
            // Test set_node_background_image with optional parameters
            jm.set_node_background_image(node.id); // All parameters optional
            jm.set_node_background_image(node.id, 'test.png'); // Only image
            jm.set_node_background_image(node.id, 'test.png', 100); // Image and width
            jm.set_node_background_image(node.id, 'test.png', 100, 100); // Image, width, height
            jm.set_node_background_image(node.id, 'test.png', 100, 100, 45); // All parameters
            jm.set_node_background_image(node.id, undefined, 100); // Only width
            jm.set_node_background_image(node.id, undefined, undefined, 100); // Only height
            jm.set_node_background_image(node.id, undefined, undefined, undefined, 45); // Only rotation
        }
    }
}

// ============================================================================
// Test 2: Optional parameters in expansion methods
// ============================================================================

function testOptionalExpansionParameters() {
    const options: JsMindOptions = {
        container: 'expansion_test'
    };
    
    const jm = new jsMind(options);
    const testData: NodeTreeFormat = {
        meta: { name: 'expansion_test', author: 'test', version: '1.0' },
        format: 'node_tree',
        data: { 
            id: 'root', 
            topic: 'Root',
            children: [
                { id: 'child1', topic: 'Child 1' },
                { id: 'child2', topic: 'Child 2' }
            ]
        }
    };
    
    jm.show(testData);
    
    // Test expand_to_depth with required depth parameter
    jm.expand_to_depth(1); // Minimum depth
    jm.expand_to_depth(2); // With depth parameter
    jm.expand_to_depth(3); // With different depth
}

// ============================================================================
// Test 3: Optional parameters in show method
// ============================================================================

function testOptionalShowParameters() {
    const options: JsMindOptions = {
        container: 'show_test'
    };
    
    const jm = new jsMind(options);
    const testData: NodeTreeFormat = {
        meta: { name: 'show_test', author: 'test', version: '1.0' },
        format: 'node_tree',
        data: { id: 'root', topic: 'Show Test Root' }
    };
    
    // Test show method with optional skip_centering parameter
    jm.show(testData); // Without skip_centering
    jm.show(testData, false); // With skip_centering = false
    jm.show(testData, true); // With skip_centering = true
}

// ============================================================================
// Test 4: Optional parameters in node manipulation methods
// ============================================================================

function testOptionalNodeManipulationParameters() {
    const options: JsMindOptions = {
        container: 'manipulation_test'
    };
    
    const jm = new jsMind(options);
    const testData: NodeTreeFormat = {
        meta: { name: 'manipulation_test', author: 'test', version: '1.0' },
        format: 'node_tree',
        data: { id: 'root', topic: 'Manipulation Test Root' }
    };
    
    jm.show(testData);
    const root = jm.get_root();
    
    if (root) {
        // Test add_node with optional parameters
        const node1 = jm.add_node(root, 'node1', 'Node 1'); // Without data and direction
        const node2 = jm.add_node(root, 'node2', 'Node 2', { color: 'red' }); // With data, without direction
        const node3 = jm.add_node(root, 'node3', 'Node 3', undefined, 'right'); // Without data, with direction
        const node4 = jm.add_node(root, 'node4', 'Node 4', { color: 'blue' }, 'left'); // With both
        
        if (node1 && node2) {
            // Test insert methods with optional parameters
            jm.insert_node_before(node1, 'before1', 'Before 1'); // Without data and direction
            jm.insert_node_after(node2, 'after1', 'After 1', { style: 'bold' }); // With data, without direction
            
            // Test move_node with optional parameters
            jm.move_node(node1.id); // Only node_id
            jm.move_node(node2.id, '_first_'); // With before_id
            jm.move_node(node1.id, '_last_', root.id); // With before_id and parent_id
            jm.move_node(node2.id, node1.id, root.id, 'right'); // All parameters
        }
    }
}

// Run all tests
testOptionalStylingParameters();
testOptionalExpansionParameters();
testOptionalShowParameters();
testOptionalNodeManipulationParameters();

console.log('Optional parameters test completed successfully!');
