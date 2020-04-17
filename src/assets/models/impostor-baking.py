import bpy
import os
import math
import bmesh

def create_sphere(segments, rings, radius):
    vertices = []
    vertices.append((0, 0, radius))
    for ring in range(1, rings):
        phi = ring / rings * math.pi 
        for segment in range(segments):
            theta = segment / segments * math.pi * 2
            x = math.cos(theta)  * math.sin(phi) * radius
            y = math.sin(theta) * math.sin(phi) * radius
            z = math.cos(phi) * radius
            vertices.append((x, y, z))
            print((x, y, z))
    vertices.append((0, 0, -radius))
    
    return vertices

# INITIALIZING  
target = bpy.context.active_object
scene = bpy.context.scene
osdir = os.path.dirname(scene.render.filepath)

# CAMERA SETUP
bpy.ops.object.camera_add()
camera_obj = bpy.context.active_object
camera_obj.data.type = 'ORTHO'
camera_obj.data.ortho_scale = 2
bpy.ops.object.constraint_add(type='TRACK_TO')
camera_obj.constraints['Track To'].target = target
camera_obj.constraints['Track To'].up_axis = 'UP_Y'
camera_obj.constraints['Track To'].track_axis = 'TRACK_NEGATIVE_Z'
scene.camera = camera_obj

# 8, 4
# 12, 6
# 16, 8
vertices = create_sphere(8, 4, 2)

# RENDERING    
index = 0
for vertex in vertices:
    camera_obj.location = vertex
    scene.render.filepath = os.path.join(osdir, target.name + '.' + str(index))
    bpy.ops.render.render(write_still=True, use_viewport=False)
    index += 1
    
# CLEANING
bpy.data.objects.remove(camera_obj, do_unlink=True)