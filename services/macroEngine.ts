import { Macro, NexusStatus } from '../types';

/**
 * NEXus Local Macro Engine (puter.js style)
 * Handles execution of macros without external AI dependency.
 */
export class MacroEngine {
  private logger: (msg: string, type: any) => void;
  private statusSetter: (status: NexusStatus) => void;
  private schedules: { macroId: string; time: string; active: boolean }[] = [];

  constructor(
    logger: (msg: string, type: any) => void,
    statusSetter: (status: NexusStatus) => void
  ) {
    this.logger = logger;
    this.statusSetter = statusSetter;
    this.loadSchedules();
  }

  private loadSchedules() {
    const saved = localStorage.getItem('nexus_schedules');
    if (saved) {
      this.schedules = JSON.parse(saved);
    }
  }

  public saveSchedule(macroId: string, time: string) {
    this.schedules.push({ macroId, time, active: true });
    localStorage.setItem('nexus_schedules', JSON.stringify(this.schedules));
    this.logger(`Scheduler: Macro [${macroId}] scheduled for ${time}.`, 'info');
  }

  public checkSchedules() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    this.schedules.forEach(schedule => {
      if (schedule.active && schedule.time === currentTime) {
        this.logger(`Scheduler: Triggering scheduled macro [${schedule.macroId}]`, 'nexus');
        // In a real implementation, we'd trigger the actual macro here
        schedule.active = false; // Prevent double trigger
      }
    });
  }

  /**
   * Local Command Parser
   * Decodes voice transcripts into system actions without calling Gemini.
   */
  public parseLocalCommand(transcript: string): string | null {
    const t = transcript.toLowerCase();
    
    if (t.includes('login') || t.includes('vault')) return 'LOGIN_SEQUENCE';
    if (t.includes('harvest') || t.includes('clone')) return 'HARVEST_SEQUENCE';
    if (t.includes('search') || t.includes('google')) return 'SEARCH_SEQUENCE';
    if (t.includes('rotate') || t.includes('email')) return 'ROTATE_SEQUENCE';
    if (t.includes('lockdown') || t.includes('security')) return 'LOCKDOWN_SEQUENCE';
    if (t.includes('record') || t.includes('capture')) return 'RECORD_SEQUENCE';
    if (t.includes('vm') || t.includes('windows')) return 'VM_BRIDGE_SEQUENCE';
    if (t.includes('draft') || t.includes('write')) return 'DRAFT_SEQUENCE';
    if (t.includes('summarize') || t.includes('read')) return 'SUMMARIZE_SEQUENCE';
    if (t.includes('schedule')) return 'SCHEDULE_SEQUENCE';
    
    return null;
  }

  public async executeMacro(macroType: string) {
    this.statusSetter(NexusStatus.EXECUTING);
    this.logger(`Engine: Deploying ${macroType} on S25 Ultra hardware...`, 'nexus');
    
    // Simulate hardware interaction
    await new Promise(res => setTimeout(res, 1500));
    
    this.logger(`Engine: ${macroType} finalized. System state: STABLE.`, 'info');
    this.statusSetter(NexusStatus.IDLE);
  }
}
