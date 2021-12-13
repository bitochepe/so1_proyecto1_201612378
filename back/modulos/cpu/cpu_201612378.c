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
	int totalpor = 0;
    int totalprocesos = -1;

    seq_printf(m, "{\n\"procesos\" : [\n");

	for_each_process(tareas)
	{
        totalprocesos = totalprocesos+1;
		if (tareas->utime > 0)
		{
			int cutime = 0;
			int cstime = 0;
            seq_printf(m, "{\n");
            seq_printf(m, "\"Pid\" :%ld,\n", tareas->pid);
            seq_printf(m, "\"Nombre\": \"%s\",\n", tareas->comm);
            seq_printf(m, "\"Usuario\": %d,\n", tareas->cred->uid);
            seq_printf(m, "\"Estado\": %ld,\n", tareas->state);
            if (tareas->mm) {
                unsigned long rss = get_mm_rss(tareas->active_mm) << PAGE_SHIFT;
                float prt;
                prt = (float) (rss/1024)*100/8112888;
                seq_printf(m, "\"Memoria\": %ld,\n", rss);
            } else {
                seq_printf(m, "\"Memoria\": %ld,\n", (long) 0);
            }

            seq_printf(m, "\"Hijos\": [\n");
			list_for_each(head, &tareas->children)
			{
				hijos = list_entry(head, struct task_struct, sibling);
				if (hijos->utime > 0 && hijos->stime>0)
				{
					cutime = cutime + hijos->utime;
					cstime = cstime + hijos->stime;
				}
                seq_printf(m, "{\n");
                seq_printf(m, "\"Pid\" :%ld,\n", hijos->pid);
                seq_printf(m, "\"Nombre\": \"%s\"\n", hijos->comm);
                seq_printf(m, "},\n");
                
			}
            seq_printf(m, "{");
            seq_printf(m, "}\n");
            seq_printf(m, "]\n");

			int total_time = tareas->utime + tareas->stime + cutime + cstime;
			int segundos = tareas->utime - (tareas->start_time / 100);
			int porcentage =  (100*((total_time) / segundos))/100;
			if (porcentage > 0 && porcentage<60)
			{
				totalpor = totalpor + porcentage;
			}
            seq_printf(m, "},\n");
		}
	}
    seq_printf(m, "{");
    seq_printf(m, "}\n");
    seq_printf(m, "],");
	seq_printf(m, "\"Total\": %d", totalprocesos);
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