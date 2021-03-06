//
// Manage the client-side caching of the user's email and access code.
//

import { centralStore } from '@/common/centralStore.js'

export const getCachedItem = (key) => {
    //debugger; // Uncomment to trigger breakpoint.
 
    let browserLocalStorage = window.localStorage;
    var cachedJsonData = null;
    var cachedItem = null;

    try {
        if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
            cachedJsonData = browserLocalStorage.getItem(key);
        } else {
            cachedJsonData = getCookie(key);
        }
        if (cachedJsonData != null && cachedJsonData != "") {
            cachedItem = JSON.parse(cachedJsonData);
        }
    } catch (err) {}

    if (cachedItem == "") {
        cachedItem = null;
    }
    return cachedItem;
}


export const cacheItem = (key, item) => {
    //debugger; // Uncomment to trigger breakpoint.

    var browserLocalStorage = window.localStorage;
    var jsonString = JSON.stringify(item);
    
    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        browserLocalStorage.setItem(key, jsonString);
    } else {
        setCookie(key, jsonString, 3650);
    }
}


export const uncacheItem = (key) => {

    var browserLocalStorage = window.localStorage;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        browserLocalStorage.removeItem(key);
    } else {
        setCookie(key, "", 0);
    }
}


export const clearLocalCache = () => {

    //debugger; // Uncomment to trigger breakpoint.
    
    var browserLocalStorage = window.localStorage;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        browserLocalStorage.clear();
    }
}


export const getLocalCacheCollection = () => {

    //debugger; // Uncomment to trigger breakpoint.

    var cachedItems = [];
    var browserLocalStorage = window.localStorage;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        for (var i = 0; i < browserLocalStorage.length; i++){
            cachedItems.push({
                key: browserLocalStorage.key(i),
                jsonValue: browserLocalStorage.getItem(browserLocalStorage.key(i))
            });
        }
    }

    return cachedItems;
}


export const setCookie  = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


export const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}