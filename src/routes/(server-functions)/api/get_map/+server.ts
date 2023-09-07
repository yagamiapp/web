import { StatusCodes } from "$lib/StatusCodes";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import prisma from "$lib/prisma";

// TEMPORARY OSU V1 USAGE UNTIL THE EXTERNAL API IS FINISHED

const OSU_V1_API_KEY = 'insert api key here';

// URL params:
//  'id' - the beatmap ID
export const GET: RequestHandler = async ({ url }) => {
    const beatmapId = url.searchParams.get('id');
    console.log(beatmapId);

    if (!beatmapId) {
        throw error(StatusCodes.BAD_REQUEST, 'Missing Required Parameter: ID');
    }

    if (!beatmapId.match(/^\d+$/)) {
        throw error(StatusCodes.BAD_REQUEST, 'ID must be a number');
    }

    // Checks the database for the map
    let beatmap = await prisma.map.findUnique({
        where: {
            beatmap_id: beatmapId
        },
    });

    // If the map isn't in the DB, 
    //  or if the map was fetched more than 1 day ago
    if (!beatmap || beatmap.fetch_time.getTime() < Date.now() - (1000 * 60 * 60 * 24)) {
        // Search API for the map and store in database
        const url = `https://osu.ppy.sh/api/get_beatmaps?k=${OSU_V1_API_KEY}&b=${beatmapId}`;
        const beatmapRequest = await fetch(url);

        const beatmapJson = (await beatmapRequest.json())[0];
        if (!beatmapJson) {
            throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong talking to osu!');
        }
        
        beatmapJson.fetch_time = new Date();

        // Convert dates in JSON to Date
        beatmapJson.submit_date = convertStringToDate(beatmapJson.submit_date);
        beatmapJson.approved_date = convertStringToDate(beatmapJson.approved_date);
        beatmapJson.last_update = convertStringToDate(beatmapJson.last_update);

        beatmap = await prisma.map.upsert({
            create: beatmapJson,
            update: beatmapJson,
            where: {
                beatmap_id: beatmapId
            }
        });
    }

    return json(beatmap);
}

function convertStringToDate(dateString: string | null) {
    if (!dateString) {
        return new Date(0);
    }
    // Match string format "YYYY-MM-DD HH:MM:SS"
    else if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        const [datePart, timePart] = dateString.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes, seconds] = timePart.split(":");
        
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
    }
    else {
        return new Date(0);
    }
}