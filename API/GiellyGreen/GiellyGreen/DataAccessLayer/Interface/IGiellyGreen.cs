using DataAccessLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Interface
{
    public interface IGiellyGreen
    {
        List<GetImage_Result> GetImages(int id = 0);
        int PostImages(int id, string url);

        List<GETSuppliers_Result> GetSuppliers(int id = 0, bool onlyActive = false);
        int PostPutSuppliers(Supplier supplier);
        int PatchActiveSuppliers(int id, bool isActive);
        int DeleteSupplier(int id);

        List<GETMonthInvoice_Result> GetMonthInvoice(int id = 0);
        int PostPutMonthInvoice(MonthInvoice monthInvoiceOBJ);

        List<GETInvoice_Result> GetInvoice(int id = 0, int monthInvoiceId = 0);
        int PostPutInvoice(Invoice invoice);

        int CheckEmailValid(String email);
    }
}
