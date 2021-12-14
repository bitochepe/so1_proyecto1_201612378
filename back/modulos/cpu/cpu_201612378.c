#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/fs.h>
#include <linux/sysinfo.h>
#include <linux/slab.h>
#include <linux/mm.h>
#include <linux/swap.h>
#include <linux/timekeeping.h>
#include <linux/cred.h>


struct sysinfo inf;

static int escribir_cpu(struct seq_file *m, void *v)
{
    struct task_struct *tareas;
	struct task_struct *hijos;
	struct list_head *head;

    int totalprocesos = -1;
    int totalejecucion = -1;
    int totalsuspendido = 0;
    int totaldetenido = -1;
    int totalzombie = -1;
    int totalunknow = -1;

    seq_printf(m, "{\n\"procesos\" : [\n");

	for_each_process(tareas)
	{
        totalprocesos++;
        seq_printf(m, "{\n");
        seq_printf(m, "\"Pid\" :%ld,\n", tareas->pid);
        seq_printf(m, "\"Nombre\": \"%s\",\n", tareas->comm);
        seq_printf(m, "\"Usuario\": %d,\n", tareas->cred->uid);
        //seq_printf(m, "\"Estado\": %ld,\n", tareas->state);
        
        if(tareas->state == 0)
        {
            seq_printf(m, "\"Estado\": \"Running\",\n");
            totalejecucion = totalejecucion+1;
        }
        else if(tareas->state == 1)
        {
            seq_printf(m, "\"Estado\": \"Suspended\",\n");
            totalsuspendido = totalsuspendido+1;
        }
        else if(tareas->state == 1026)
        {
            seq_printf(m, "\"Estado\": \"Suspended\",\n");
            totalsuspendido = totalsuspendido+1;
        }
        else if(tareas->state == 4)
        {
            seq_printf(m, "\"Estado\": \"Zombie\",\n");
            totalzombie = totalzombie+1;
        }
        else if(tareas->state == 8)
        {
            seq_printf(m, "\"Estado\": \"Stopped\",\n");
            totaldetenido = totaldetenido+1;
        }
        else if(tareas->exit_state == 16)
        {
            seq_printf(m, "\"Estado\": \"Zombie\",\n");
            totalzombie = totalzombie+1;
        }
        else
        {
            seq_printf(m, "\"Estado\": \"Unknown\",\n");
            totalunknow = totalunknow+1;
        }   

        if (tareas->mm) {
            unsigned long rss = get_mm_rss(tareas->active_mm) << PAGE_SHIFT;
            seq_printf(m, "\"Memoria\": %ld,\n", rss);
        } 
        else {
            seq_printf(m, "\"Memoria\": %ld,\n", (long) 0);
        }

        seq_printf(m, "\"Hijos\": [\n");
        list_for_each(head, &tareas->children)
        {
            hijos = list_entry(head, struct task_struct, sibling);
            seq_printf(m, "{\n");
            seq_printf(m, "\"Pid\" :%ld,\n", hijos->pid);
            seq_printf(m, "\"Nombre\": \"%s\"\n", hijos->comm);
            seq_printf(m, "},\n");
            
        }
        seq_printf(m, "{");
        seq_printf(m, "}\n");
        seq_printf(m, "]\n");
        seq_printf(m, "},\n");
	}

    if(totalprocesos == -1)totalprocesos = 0;
    if(totalejecucion == -1)totalejecucion = 0;
    if(totalsuspendido == -1)totalsuspendido = 0;
    if(totaldetenido == -1)totaldetenido = 0;
    if(totalzombie == -1)totalzombie = 0;
    if(totalunknow == -1)totalunknow = 0;

    seq_printf(m, "{");
    seq_printf(m, "}\n");
    seq_printf(m, "],");
    seq_printf(m, "\"TotalProcesos\": %d,\n", totalprocesos);
    seq_printf(m, "\"TotalEjecucion\": %d,\n", totalejecucion);
    seq_printf(m, "\"TotalSuspendido\": %d,\n", totalsuspendido);
    seq_printf(m, "\"TotalDetenido\": %d,\n", totaldetenido);
    seq_printf(m, "\"TotalUnknow\": %d,\n", totalunknow);
    seq_printf(m, "\"TotalZombie\": %d\n", totalzombie);
    seq_printf(m, "}");
	return 0;
}


static int abre_cpu(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_cpu, NULL);
}

static struct proc_ops ops_cpu={
    .proc_open = abre_cpu,
    .proc_read = seq_read
};


static int __init cpuMod_init(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("cpu_201612378", 0777, NULL, &ops_cpu);
    if (!entry)
	{
		return -1;
	}
	else
	{
		printk(KERN_INFO "Mensaje de inicio modulo: cpu_201612378\n");
	}
	return 0;
}

static void __exit cpuMod_exit(void)
{
    remove_proc_entry("cpu_201612378", NULL);
    printk(KERN_INFO "Mensaje de salida modulo: cpu_201612378\n");
}


module_init(cpuMod_init);
module_exit(cpuMod_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("bitochepe - 201612378");
MODULE_DESCRIPTION("Modulo de CPU SO1"); 