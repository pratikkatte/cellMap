import * as THREE from 'three';

export const GeometryHelpers = {
    // Create a tube network for ER
    createERTube(points, radius = 0.3) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, points.length * 2, radius, 8, false);
        return geometry;
    },
    
    // Create irregular shape for vacuole
    createIrregularShape(radius = 1, segments = 8) {
        const shape = new THREE.Shape();
        const points = [];
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const r = radius * (0.7 + Math.random() * 0.6);
            points.push([
                Math.cos(angle) * r,
                Math.sin(angle) * r
            ]);
        }
        
        shape.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i][0], points[i][1]);
        }
        shape.lineTo(points[0][0], points[0][1]);
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: radius * 0.8,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1
        });
        
        return geometry;
    },
    
    // Create cristae for mitochondria
    createCristae(length, width, folds = 5) {
        const group = new THREE.Group();
        
        for (let i = 0; i < folds; i++) {
            const geometry = new THREE.PlaneGeometry(width, length);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);
            
            plane.rotation.x = Math.PI / 2;
            plane.position.z = (i - folds / 2) * (length / folds);
            plane.position.y = Math.sin(i * 0.5) * 0.3;
            
            group.add(plane);
        }
        
        return group;
    }
};

