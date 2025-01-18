import { RootState } from '../index';
import { GliderSchema } from '../../lib/types';
import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectGliders = (state: RootState) => state.aircraft.gliders;
const selectGliderOwnerships = (state: RootState) => state.aircraft.gliderOwnerships;

// Get club gliders (no ownership records)
export const getClubGliders = createSelector(
    [selectGliders, selectGliderOwnerships],
    (gliders, ownerships): GliderSchema[] => {
        if (!gliders) return [];
        
        return gliders.filter(glider => 
            !ownerships?.some(ownership => ownership.glider_id === glider.id)
        );
    }
);

// Get two-seater gliders
export const getTwoSeaterGliders = createSelector(
    [selectGliders],
    (gliders): GliderSchema[] => {
        if (!gliders) return [];
        
        return gliders.filter(glider => glider.num_seats === 2);
    }
);

// Get club two-seater gliders
export const getClubTwoSeaterGliders = createSelector(
    [getClubGliders, getTwoSeaterGliders],
    (clubGliders, twoSeaterGliders): GliderSchema[] => {
        return clubGliders.filter(glider => 
            twoSeaterGliders.some(twoSeater => twoSeater.id === glider.id)
        );
    }
); 