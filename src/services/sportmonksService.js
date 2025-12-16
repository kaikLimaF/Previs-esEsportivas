import { supabase } from "@/integrations/supabase/client";

export const sportmonksService = {
  async fetchFixtures() {
    const { data, error } = await supabase.functions.invoke('fetch-sportmonks', {
      body: { action: 'fetch-fixtures' }
    });
    
    if (error) throw error;
    return data;
  },

  async fetchTeams() {
    const { data, error } = await supabase.functions.invoke('fetch-sportmonks', {
      body: { action: 'fetch-teams' }
    });
    
    if (error) throw error;
    return data;
  },

  async fetchTeamStats(teamId) {
    const { data, error } = await supabase.functions.invoke('fetch-sportmonks', {
      body: { action: 'fetch-team-stats', teamId }
    });
    
    if (error) throw error;
    return data;
  }
};
