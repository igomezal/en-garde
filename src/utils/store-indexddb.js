import { openDB } from 'idb';

const db = openDB('notifications', 1, {
    upgrade(db) {
        if(!db.objectStoreNames.contains('notifications')) db.createObjectStore('notifications', {keyPath: 'id', autoIncrement:true});
    }
});

export function addNotification(notification) {
    return db.then((db) => {
        const tx = db.transaction('notifications', 'readwrite');
        const store = tx.objectStore('notifications')
        return store.add(notification);
    });
}

export function deleteNotification(notificationId) {
    return db.then((db) => {
        const tx = db.transaction('notifications', 'readwrite');
        const store = tx.objectStore('notifications')
        store.delete(notificationId);
    });
}

export function updateNotification(notification) {
    return db.then((db) => {
        const tx = db.transaction('notifications', 'readwrite');
        const store = tx.objectStore('notifications')
        store.put(notification);
    });
}

export function getNotification(index) {
    return db.then(db => {
        const tx = db.transaction('notifications', 'readonly');
        const store = tx.objectStore('notifications');
        return store.get(index);
    });
}

export function getAllNotifications() {
    return db.then(db => {
        const tx = db.transaction('notifications', 'readonly');
        const store = tx.objectStore('notifications');
        return store.getAll();
    });
}

export function deleteAllNotifications() {
    return db.then(db => {
        const tx = db.transaction('notifications', 'readwrite');
        const store = tx.objectStore('notifications');
        return store.clear();
    });
}