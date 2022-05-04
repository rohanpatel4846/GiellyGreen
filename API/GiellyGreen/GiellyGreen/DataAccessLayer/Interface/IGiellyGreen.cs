using DataAccessLayer.Model;
using GiellyGreen.Models.Invoice;
using GiellyGreen.Models.Month;
using GiellyGreen.Models.Profile;
using GiellyGreen.Models.Supplier;
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
        int PostPutSuppliers(SupplierViewModel supplier);
        int PatchActiveSuppliers(int id, bool isActive);
        int DeleteSupplier(int id);

        List<GETMonthInvoice_Result> GetMonthInvoice(int id = 0);
        int PostPutMonthInvoice(MonthInvoiceViewModel monthInvoiceOBJ);

        List<GETInvoice_Result> GetInvoice(int id = 0, int monthInvoiceId = 0);
        int PostPutInvoice(InvoiceViewModel invoice);

        int CheckEmailValid(String email);
        int CheckSupplierRefValid(String SupplierRef);
        int CheckVATNumberValid(String vatNumber);
        int CheckTAXReferenceValid(String taxReference);
        int CheckInvoiceReferenceNumberValid(String invoiceRef);

        int PostPutProfile(ProfileViewModal pro);
        GetLastProfile_Result GetProfile();
    }
}
